// 在构建时把 src/chatbot/skills/ 下所有 .skill 和 .md 文件作为原始文本读入。
// 用 Vite 的 glob import（?raw）内联内容，因此在 Vercel serverless 运行时
// 不依赖文件系统，部署后也能稳定读到。
//
// 想调整 chatbot 的人格 / 行为？直接编辑或新增 skills/ 下的 .skill 或 .md 文件，
// 重新部署即可生效。文件名按字母序拼接。

const modules = import.meta.glob("./skills/*.{skill,md}", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>

/** 拼接所有 .skill 文件，作为发给模型的 system prompt。 */
export function buildSystemPrompt(): string {
  const entries = Object.entries(modules).sort(([a], [b]) => a.localeCompare(b))

  const skills = entries
    .map(([, content]) => content.trim())
    .filter(Boolean)
    .join("\n\n---\n\n")

  return skills
}

/** 已加载的 skill 文件数量（用于健康检查 / 调试）。 */
export const SKILL_COUNT = Object.keys(modules).length
