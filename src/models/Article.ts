import mongoose, { Schema, models } from "mongoose";

const ArticleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    status: {
      type: String,
      enum: [
        "draft",
        "review",
        "published",
        "archived",
      ],
      default: "draft",
      index: true,
    },
    
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    currentRevision: {
      type: Schema.Types.ObjectId,
      ref: "ArticleRevision",
      default: null,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Article ||
  mongoose.model("Article", ArticleSchema);