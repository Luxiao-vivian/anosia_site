/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** 选择 AI provider："gemini"（默认）或 "deepseek"。 */
  readonly AI_PROVIDER?: "gemini" | "deepseek"
  /** Gemini (Google AI Studio) API key，仅在服务端使用，绝不要暴露到前端。 */
  readonly GEMINI_API_KEY?: string
  /** DeepSeek API key，仅在服务端使用，绝不要暴露到前端。 */
  readonly DEEPSEEK_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}