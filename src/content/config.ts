import { defineCollection, z } from "astro:content"

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    draft: z.boolean().optional(),
  }),
})

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    draft: z.boolean().optional(),
    demoUrl: z.string().optional(),
    repoUrl: z.string().optional(),
  }),
})

// Cabinet — short fragments, quotes, and findings from the web.
// Every field except `date` is optional, so fragments can be as bare or as rich as you like.
const cabinet = defineCollection({
  type: "content",
  schema: z.object({
    date: z.coerce.date(),
    title: z.string().optional(),
    sourceUrl: z.string().url().optional(),
    sourceTitle: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
  }),
})

export const collections = { blog, projects, cabinet }
