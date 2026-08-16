import { z } from "zod";

export const CreateArticleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(300, "Title cannot exceed 300 characters"),

  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(300, "Slug cannot exceed 300 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
});

export const UpdateArticleSchema =
  CreateArticleSchema.partial();

export type CreateArticleInput =
  z.infer<typeof CreateArticleSchema>;

export type UpdateArticleInput =
  z.infer<typeof UpdateArticleSchema>;
