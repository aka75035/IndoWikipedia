import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    displayName: {
      type: String,
      required: true,
      trim: true,
    },

    avatar: {
      type: String,
      default: null,
    },

    bio: {
      type: String,
      default: "",
      maxlength: 1000,
    },

    role: {
      type: String,
      enum: [
        "user",
        "contributor",
        "editor",
        "moderator",
        "admin",
      ],
      default: "user",
      index: true,
    },

    status: {
      type: String,
      enum: [
        "active",
        "suspended",
        "banned",
      ],
      default: "active",
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

export default models.User ||
  mongoose.model("User", UserSchema);