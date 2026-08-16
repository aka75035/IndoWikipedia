import { z } from "zod";
const BlockSchema = z.object({
  type: z.enum([
    "paragraph",
    "heading",
    "table",
    "image",
    "gallery",
    "video",
    "quote",
    "list",
    "ordered-list",
    "code",
    "math",
    "reference",
    "link",
    "infobox",
  ]),

  content: z.unknown().nullable().optional(),

  order: z
    .number()
    .int()
    .min(0),
});

const SectionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Section title is required"),

  level: z
    .number()
    .int()
    .min(1)
    .max(6),

  blocks: z
    .array(BlockSchema)
    .default([]),

  order: z
    .number()
    .int()
    .min(0),
});

const InfoboxFieldSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, "Infobox label is required"),

  value: z.unknown(),

  order: z
    .number()
    .int()
    .min(0),
});

const InfoboxSchema = z.object({
  title: z
    .string()
    .trim()
    .optional()
    .default(""),

  image: z
    .string()
    .trim()
    .url("Infobox image must be a valid URL")
    .nullable()
    .optional(),

  fields: z
    .array(InfoboxFieldSchema)
    .default([]),
});

const ReferenceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Reference title is required"),

  url: z
    .string()
    .trim()
    .url("Reference URL must be valid"),

  publisher: z
    .string()
    .trim()
    .optional(),

  author: z
    .string()
    .trim()
    .optional(),

  publishedAt: z
    .string()
    .datetime()
    .optional(),

  accessedAt: z
    .string()
    .datetime()
    .optional(),

  description: z
    .string()
    .trim()
    .optional()
    .default(""),
});

export const CreateRevisionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Revision title is required")
    .max(300, "Title cannot exceed 300 characters"),

  summary: z
    .string()
    .trim()
    .max(
      1000,
      "Summary cannot exceed 1000 characters"
    )
    .optional()
    .default(""),

  sections: z
    .array(SectionSchema)
    .default([]),

  infobox: InfoboxSchema
    .nullable()
    .optional()
    .default(null),

  references: z
    .array(ReferenceSchema)
    .default([]),

  categories: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Category ID is required")
    )
    .default([]),

  editSummary: z
    .string()
    .trim()
    .max(
      500,
      "Edit summary cannot exceed 500 characters"
    )
    .optional()
    .default(""),
});

export type CreateRevisionInput =
  z.infer<typeof CreateRevisionSchema>;