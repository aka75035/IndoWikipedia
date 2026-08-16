import mongoose, { Schema, models } from "mongoose";

const ArticleContributorSchema = new Schema(
  {
    article: {
      type: Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: [
        "creator",
        "contributor",
        "editor",
        "reviewer",
      ],
      default: "contributor",
    },

    editCount: {
      type: Number,
      default: 0,
    },
  },

  {
    timestamps: true,
  }
);

ArticleContributorSchema.index(
  { article: 1, user: 1 },
  { unique: true }
);