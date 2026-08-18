import mongoose, { Schema, models } from "mongoose";

const ReferenceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      default: "",
    },

    author: {
      type: String,
      default: "",
    },

    publisher: {
      type: String,
      default: "",
    },

    publicationDate: {
      type: Date,
      default: null,
    },

    accessedDate: {
      type: Date,
      default: null,
    },

    description: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: [
        "website",
        "book",
        "journal",
        "newspaper",
        "video",
        "other",
      ],
      default: "website",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

export default models.Reference || mongoose.model("Reference", ReferenceSchema);