import mongoose, { Schema, models } from "mongoose";

const WatchlistSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    article: {
      type: Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

WatchlistSchema.index(
  { user: 1, article: 1 },
  { unique: true }
);

export default models.Watchlist || mongoose.model("Watchlist", WatchlistSchema);