import mongoose, { Schema, models } from "mongoose";

const ReportSchema = new Schema(
  {
    article: {
      type: Schema.Types.ObjectId,
      ref: "Article",
      index: true,
    },

    revision: {
      type: Schema.Types.ObjectId,
      ref: "ArticleRevision",
      default: null,
    },

    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reason: {
      type: String,
      enum: [
        "incorrect_information",
        "copyright",
        "spam",
        "harassment",
        "vandalism",
        "other",
      ],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "investigating",
        "resolved",
        "rejected",
      ],
      default: "pending",
    },

    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);