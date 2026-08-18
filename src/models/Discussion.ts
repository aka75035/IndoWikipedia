import mongoose, { Schema, models } from "mongoose";

const DiscussionSchema = new Schema(
  {
    article: {
      type: Schema.Types.ObjectId,
      ref: "Article",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    parent: {
      type: Schema.Types.ObjectId,
      ref: "Discussion",
      default: null,
    },

    status: {
      type: String,
      enum: [
        "open",
        "resolved",
        "closed",
      ],
      default: "open",
    },
  },

  {
    timestamps: true,
  }
);
export default models.Discussion || mongoose.model("Discussion", DiscussionSchema);