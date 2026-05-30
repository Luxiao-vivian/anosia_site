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

## API Key（Gemini，免费）

1. 去 https://aistudio.google.com/apikey 用 Google 账号免费生成一个 key。
2. 本地：把 `.env.example` 复制成 `.env`，填入 `GEMINI_API_KEY`。
3. 线上（Vercel）：在 Project Settings → Environment Variables 添加 `GEMINI_API_KEY`。

## 换模型

在 `../pages/api/chat.ts` 顶部改 `MODEL` 常量。免费额度内可用：
`gemini-2.5-flash`（默认，质量更好）、`gemini-2.5-flash-lite`（更快、每日额度更高）。
