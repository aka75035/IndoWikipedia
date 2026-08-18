import Article from "@/models/Article";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export async function getEditorStats() {
  await connectDB();

  const [
    review,
    published,
    featured,
    contributors,
  ] = await Promise.all([
    Article.countDocuments({
      status: "review",
    }),

    Article.countDocuments({
      status: "published",
    }),

    Article.countDocuments({
      status: "published",
      isFeatured: true,
    }),

    User.countDocuments({
      role: "contributor",
      status: "active",
    }),
  ]);

  return {
    review,
    published,
    featured,
    contributors,
  };
}