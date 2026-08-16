import mongoose, { Schema, models } from "mongoose";

const ArticleTranslationSchema = new Schema(
  {
    article: {
      type: Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },

    language: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
    },

    revision: {
      type: Schema.Types.ObjectId,
      ref: "ArticleRevision",
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

ArticleTranslationSchema.index(
  { language: 1, slug: 1 },
  { unique: true }
);