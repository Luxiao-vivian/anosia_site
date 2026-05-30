# Chatbot（Anosia 的网站分身）

挂 Gemini API（OpenAI 兼容接口）的小聊天机器人。通过 `skills/` 里的文件喂人格设定，
让它模仿我和访客聊天。

## 结构

- `skills/*.{skill,md}` —— 人格与行为设定（纯文本/Markdown）。**改这里就能调教它。**
- `skills.ts` —— 构建时把所有 skill 文件拼成发给模型的 system prompt。
- `../pages/api/chat.ts` —— 服务端接口，保管 API key 并把请求转发给 Gemini（流式）。
- `../components/Chat.tsx` —— 前端聊天界面（SolidJS）。
- `../pages/chat/index.astro` —— `/chat` 页面。

## 怎么调教它

直接编辑或新增 `skills/` 下的 `.skill` 或 `.md` 文件，重新部署即可生效。
文件按文件名字母序拼接，互相之间用 `---` 分隔。

## 选择 AI provider（Gemini / DeepSeek）

用环境变量 `AI_PROVIDER` 切换，默认 `gemini`：

- `AI_PROVIDER=gemini` —— 免费额度，海外节点（如 Vercel 美国）直连；**国内服务器会被墙**。
- `AI_PROVIDER=deepseek` —— 便宜、中文好，`api.deepseek.com` 国内可直连；**迁站到国内时用它**。

切到哪家就配哪家的 key（两个都填也行，按 `AI_PROVIDER` 取用）。

## API Key

1. Gemini：https://aistudio.google.com/apikey（免费）→ 填 `GEMINI_API_KEY`
2. DeepSeek：https://platform.deepseek.com/api_keys → 填 `DEEPSEEK_API_KEY`
3. 本地：把 `.env.example` 复制成 `.env` 填进去。
4. 线上（Vercel）：在 Project Settings → Environment Variables 添加对应变量。

## 换模型

在 `../pages/api/chat.ts` 顶部的 `PROVIDERS` 配置里改各 provider 的 `model`。
Gemini 免费可用 `gemini-2.5-flash-lite`（默认）/ `gemini-2.5-flash`；DeepSeek 用 `deepseek-chat`。
