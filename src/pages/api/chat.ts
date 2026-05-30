import type { APIRoute } from "astro"
import { buildSystemPrompt } from "@chatbot/skills"

// 这个路由必须在服务端按需运行（保管 API key、转发请求），不能预渲染。
export const prerender = false

// ───────────────────────────────────────────────────────────────────────────
// AI provider 配置（可切换）。
// 用环境变量 AI_PROVIDER = "gemini" | "deepseek" 选择，默认 gemini。
// 两家都用「OpenAI 兼容」接口，请求/流式格式一致，所以下面解析逻辑通用。
//
//   - gemini   : 免费额度，海外节点（如 Vercel 美国）直连；国内服务器会被墙。
//   - deepseek : 便宜、中文好，api.deepseek.com 国内可直连；将来迁站国内时用它。
//
// 各自的 API key 用各自的环境变量：GEMINI_API_KEY / DEEPSEEK_API_KEY。
// ───────────────────────────────────────────────────────────────────────────
type ProviderId = "gemini" | "deepseek"

type ProviderConfig = {
  label: string
  url: string
  model: string
  apiKeyEnv: "GEMINI_API_KEY" | "DEEPSEEK_API_KEY"
  // 关闭模型「思考」的额外参数（仅部分模型支持）。
  extraBody?: Record<string, unknown>
}

const PROVIDERS: Record<ProviderId, ProviderConfig> = {
  gemini: {
    label: "Gemini",
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    // flash-lite 免费额度更高、响应更快。
    model: "gemini-2.5-flash-lite",
    apiKeyEnv: "GEMINI_API_KEY",
    // 关掉 Gemini 2.5 默认的「思考」，首字更快、更省额度。
    extraBody: { reasoning_effort: "none" },
  },
  deepseek: {
    label: "DeepSeek",
    url: "https://api.deepseek.com/chat/completions",
    model: "deepseek-chat",
    apiKeyEnv: "DEEPSEEK_API_KEY",
  },
}

function env(name: string): string | undefined {
  return import.meta.env[name] ?? process.env[name]
}

// 尝试顺序：先用 AI_PROVIDER 指定的（默认 gemini），失败再依次尝试其它家。
// 这样 Gemini 返回 429（或连不上）时会自动切到 DeepSeek。
function getProviderChain(): ProviderConfig[] {
  const primaryId = (env("AI_PROVIDER") ?? "gemini").toLowerCase() as ProviderId
  const primary = PROVIDERS[primaryId] ?? PROVIDERS.gemini
  const rest = (Object.keys(PROVIDERS) as ProviderId[])
    .filter((id) => PROVIDERS[id] !== primary)
    .map((id) => PROVIDERS[id])
  return [primary, ...rest]
}

// 单次发给模型的历史消息上限，避免请求过大 / 费用失控。
const MAX_HISTORY = 12
// 单条消息的最大字符数。
const MAX_CONTENT_LENGTH = 4000

// 按访客（IP）限速：窗口期内最多允许多少条消息。
// 注意：serverless 是多实例的，这是「每个实例各自计数」的内存限速，
// 足以挡住单个用户的快速狂刷；要全站精确限速需接 Vercel KV / Upstash。
const RATE_LIMIT_MAX = 8
const RATE_LIMIT_WINDOW_MS = 60_000

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

// ip -> 最近一段时间内的请求时间戳列表（滑动窗口）。
const rateLimitHits = new Map<string, number[]>()

function getClientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0].trim()
  return request.headers.get("x-real-ip") ?? "unknown"
}

/** 返回 null 表示通过；返回数字表示需等待的秒数（已超限）。 */
function checkRateLimit(ip: string): number | null {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_WINDOW_MS

  const recent = (rateLimitHits.get(ip) ?? []).filter((t) => t > windowStart)

  if (recent.length >= RATE_LIMIT_MAX) {
    const retryMs = recent[0] + RATE_LIMIT_WINDOW_MS - now
    return Math.max(1, Math.ceil(retryMs / 1000))
  }

  recent.push(now)
  rateLimitHits.set(ip, recent)

  // 顺手清理已经没有近期记录的 IP，避免 Map 无限增长。
  if (rateLimitHits.size > 5000) {
    for (const [key, hits] of rateLimitHits) {
      if (hits.every((t) => t <= windowStart)) rateLimitHits.delete(key)
    }
  }

  return null
}

function json(data: unknown, status = 200, headers?: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  })
}

export const POST: APIRoute = async ({ request }) => {
  const retryAfter = checkRateLimit(getClientIp(request))
  if (retryAfter !== null) {
    return json(
      { error: `你发得太快啦，歇 ${retryAfter} 秒再聊~` },
      429,
      { "Retry-After": String(retryAfter) },
    )
  }

  let body: { messages?: unknown }
  try {
    body = await request.json()
  } catch {
    return json({ error: "请求体不是合法的 JSON。" }, 400)
  }

  const rawMessages = Array.isArray(body.messages) ? body.messages : []

  const messages: ChatMessage[] = rawMessages
    .filter(
      (m): m is ChatMessage =>
        !!m &&
        typeof m === "object" &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string",
    )
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CONTENT_LENGTH) }))

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return json({ error: "缺少有效的用户消息。" }, 400)
  }

  const systemPrompt = buildSystemPrompt()
  const chatMessages = [{ role: "system", content: systemPrompt }, ...messages]

  // 按 provider 链依次尝试：某家 429 / 连不上 / 5xx 就自动切到下一家。
  let upstream: Response | null = null
  let lastError: { label: string; status: number; detail: string } | null = null

  for (const provider of getProviderChain()) {
    const apiKey = env(provider.apiKeyEnv)
    if (!apiKey) continue // 没配这家的 key 就跳过

    let res: Response
    try {
      res = await fetch(provider.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: provider.model,
          stream: true,
          temperature: 0.8,
          ...provider.extraBody,
          messages: chatMessages,
        }),
      })
    } catch {
      lastError = { label: provider.label, status: 0, detail: "连接失败" }
      continue // 连不上，试下一家
    }

    if (res.ok && res.body) {
      upstream = res
      break
    }

    const detail = await res.text().catch(() => "")
    lastError = { label: provider.label, status: res.status, detail }

    // 限流(429) / 服务端错误(5xx) → 自动切换到下一家；其它错误直接返回。
    if (res.status === 429 || res.status >= 500) continue
    return json(
      { error: `${provider.label} 返回错误 (${res.status})。`, detail: detail.slice(0, 500) },
      502,
    )
  }

  if (!upstream) {
    if (!lastError) {
      return json({ error: "服务端没有配置任何可用的 AI provider key。" }, 500)
    }
    return json(
      {
        error: `${lastError.label} 暂时不可用 (${lastError.status})，且没有可用的备用 provider。`,
        detail: lastError.detail.slice(0, 500),
      },
      502,
    )
  }

  // 把上游的 SSE 流解析出纯文本增量，转成简单的纯文本流给前端。
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.body!.getReader()
      let buffer = ""

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() ?? ""

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed.startsWith("data:")) continue

            const data = trimmed.slice(5).trim()
            if (data === "[DONE]") {
              controller.close()
              return
            }

            try {
              const parsed = JSON.parse(data)
              const delta: string | undefined = parsed.choices?.[0]?.delta?.content
              if (delta) controller.enqueue(encoder.encode(delta))
            } catch {
              // 忽略无法解析的行（如空 keep-alive 行）。
            }
          }
        }
        controller.close()
      } catch (err) {
        controller.error(err)
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  })
}
