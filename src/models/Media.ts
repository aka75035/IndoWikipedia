import mongoose, { Schema, models } from "mongoose";

const MediaSchema = new Schema(
  {
    type: {
      type: String,
      enum: [
        "image",
        "video",
        "audio",
        "document",
        "file",
      ],
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    thumbnailUrl: {
      type: String,
      default: null,
    },

    title: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    caption: {
      type: String,
      default: "",
    },

    altText: {
      type: String,
      default: "",
    },

    mimeType: {
      type: String,
      default: "",
    },

    size: {
      type: Number,
      default: 0,
    },

    width: {
      type: Number,
      default: null,
    },

    height: {
      type: Number,
      default: null,
    },

    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

export default models.Media ||
  mongoose.model("Media", MediaSchema);