import { createSignal, For, onMount, Show } from "solid-js"

type Role = "user" | "assistant"
type Message = { role: Role; content: string }

const GREETING =
  "Hi~ o(*￣▽￣*)ブ 欢迎来到我的 grove。我是 Anosia 在这里的分身，想聊点什么都可以~"

export default function Chat() {
  const [messages, setMessages] = createSignal<Message[]>([
    { role: "assistant", content: GREETING },
  ])
  const [input, setInput] = createSignal("")
  const [loading, setLoading] = createSignal(false)
  const [error, setError] = createSignal("")

  let scrollRef: HTMLDivElement | undefined
  let inputRef: HTMLTextAreaElement | undefined

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (scrollRef) scrollRef.scrollTop = scrollRef.scrollHeight
    })
  }

  onMount(() => inputRef?.focus())

  const send = async () => {
    const text = input().trim()
    if (!text || loading()) return

    setError("")
    setInput("")
    if (inputRef) inputRef.style.height = "auto"

    const history = [...messages(), { role: "user", content: text } as Message]
    // 占位的助手消息，随流式增量逐字填充。
    setMessages([...history, { role: "assistant", content: "" }])
    setLoading(true)
    scrollToBottom()

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      })

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `请求失败 (${res.status})`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        setMessages((prev) => {
          const next = [...prev]
          next[next.length - 1] = {
            role: "assistant",
            content: next[next.length - 1].content + chunk,
          }
          return next
        })
        scrollToBottom()
      }
    } catch (err) {
      // 出错时移除空的占位助手消息，并提示。
      setMessages((prev) => {
        const next = [...prev]
        if (next[next.length - 1]?.content === "") next.pop()
        return next
      })
      setError(err instanceof Error ? err.message : "出了点问题，稍后再试试~")
    } finally {
      setLoading(false)
      scrollToBottom()
      inputRef?.focus()
    }
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const onInput = (e: InputEvent) => {
    const target = e.target as HTMLTextAreaElement
    setInput(target.value)
    target.style.height = "auto"
    target.style.height = `${Math.min(target.scrollHeight, 160)}px`
  }

  return (
    <div class="flex flex-col h-[70vh] min-h-[420px] rounded-2xl border border-olive-700/20 bg-bean-50 overflow-hidden">
      <div ref={scrollRef} class="flex-1 overflow-y-auto p-4 space-y-4">
        <For each={messages()}>
          {(msg) => (
            <div
              class={
                msg.role === "user"
                  ? "flex justify-end"
                  : "flex justify-start"
              }
            >
              <div
                class={
                  (msg.role === "user"
                    ? "bg-olive-700 text-bean-50 rounded-br-sm"
                    : "bg-bean-200 text-ink-900 rounded-bl-sm") +
                  " max-w-[85%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap break-words leading-relaxed"
                }
              >
                <Show when={msg.content} fallback={<TypingDots />}>
                  {msg.content}
                </Show>
              </div>
            </div>
          )}
        </For>
      </div>

      <Show when={error()}>
        <div class="px-4 py-2 text-xs text-red-700 bg-red-50 border-t border-red-200">
          {error()}
        </div>
      </Show>

      <div class="border-t border-olive-700/20 p-3 bg-bean-100">
        <div class="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input()}
            onInput={onInput}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="说点什么…（Enter 发送，Shift+Enter 换行）"
            class="flex-1 resize-none bg-transparent text-sm text-ink-900 placeholder:text-ink-700/50 focus:outline-none max-h-40 py-2"
          />
          <button
            onClick={send}
            disabled={loading() || !input().trim()}
            class="shrink-0 h-9 px-4 rounded-full text-sm bg-olive-700 text-bean-50 hover:bg-olive-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-300 ease-in-out"
          >
            {loading() ? "…" : "发送"}
          </button>
        </div>
      </div>
    </div>
  )
}

function TypingDots() {
  return (
    <span class="inline-flex gap-1 items-center py-1">
      <span class="size-1.5 rounded-full bg-ink-700/50 animate-bounce [animation-delay:-0.3s]" />
      <span class="size-1.5 rounded-full bg-ink-700/50 animate-bounce [animation-delay:-0.15s]" />
      <span class="size-1.5 rounded-full bg-ink-700/50 animate-bounce" />
    </span>
  )
}
