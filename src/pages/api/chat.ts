import type { APIRoute } from "astro"
import { buildSystemPrompt } from "@chatbot/skills"

// 这个路由必须在服务端按需运行（保管 API key、转发请求），不能预渲染。
export const prerender = false

// 用 Gemini 的「OpenAI 兼容」接口，请求/流式格式和 OpenAI 一致。
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
// 使用的模型。gemini-2.5-flash / gemini-2.5-flash-lite 都在免费额度内。
const MODEL = "gemini-2.5-flash"
// 单次发给模型的历史消息上限，避免请求过大 / 费用失控。
const MAX_HISTORY = 12
// 单条消息的最大字符数。
const MAX_CONTENT_LENGTH = 4000

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.GEMINI_API_KEY ?? process.env.GEMINI_API_KEY

  if (!apiKey) {
    return json({ error: "服务端未配置 GEMINI_API_KEY。" }, 500)
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

  let upstream: Response
  try {
    upstream = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        temperature: 0.8,
        // 关掉 Gemini 2.5 默认的「思考」，首字更快、更省额度。
        reasoning_effort: "none",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
      }),
    })
  } catch {
    return json({ error: "无法连接到 Gemini。" }, 502)
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "")
    return json(
      { error: `Gemini 返回错误 (${upstream.status})。`, detail: detail.slice(0, 500) },
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
