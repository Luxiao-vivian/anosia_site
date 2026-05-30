import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import solidJs from "@astrojs/solid-js"
import vercel from "@astrojs/vercel/serverless"

// https://astro.build/config
export default defineConfig({
  site: "https://astro-sphere-demo.vercel.app",
  // hybrid: 全站默认静态预渲染，只有显式 `export const prerender = false`
  // 的路由（即 /api/chat）会在 Vercel serverless 上按需运行。
  output: "hybrid",
  adapter: vercel(),
  integrations: [mdx(), sitemap(), solidJs(), tailwind({ applyBaseStyles: false })],
})