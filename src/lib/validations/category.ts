import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(100, "Category name cannot exceed 100 characters"),

  slug: z
    .string()
    .trim()
    .min(1, "Category slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),

  description: z
    .string()
    .trim()
    .max(
      500,
      "Description cannot exceed 500 characters"
    )
    .default(""),

  parent: z
    .string()
    .trim()
    .min(1)
    .nullable()
    .optional(),

  image: z
    .string()
    .trim()
    .url("Image must be a valid URL")
    .nullable()
    .optional(),
});

export const UpdateCategorySchema =
  CreateCategorySchema.partial();

export type CreateCategoryInput =
  z.infer<typeof CreateCategorySchema>;

export type UpdateCategoryInput =
  z.infer<typeof UpdateCategorySchema>;