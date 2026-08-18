import mongoose, { Schema, models } from "mongoose";

const NotificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "article_edit",
        "revision_approved",
        "discussion_reply",
        "report_update",
        "mention",
        "system",
      ],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    article: {
      type: Schema.Types.ObjectId,
      ref: "Article",
      default: null,
    },

    actor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },

  {
    timestamps: true,
  }
);

export default models.Notification || mongoose.model("Notification", NotificationSchema);