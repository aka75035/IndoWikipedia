import { z } from "zod";

export const ArticleSchema = z.object({
  title: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  content: z.string().trim().min(1),
  category: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  image: z.string().trim().min(1),
});

export const UpdateArticleSchema = ArticleSchema.partial();
export type CreateArticleInput = z.infer<typeof ArticleSchema>;
export type UpdateArticleInput = z.infer<typeof UpdateArticleSchema>;