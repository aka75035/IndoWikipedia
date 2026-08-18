import User from "@/models/User";
import Article from "@/models/Article";
import Category from "@/models/Category";
import Report from "@/models/Report";

import { connectDB } from "@/lib/mongodb";

export async function getAdminStats() {
  await connectDB();

  const [
    users,
    articles,
    published,
    drafts,
    review,
    featured,
    categories,
    reports,
  ] = await Promise.all([
    User.countDocuments(),

    Article.countDocuments(),

    Article.countDocuments({
      status: "published",
    }),

    Article.countDocuments({
      status: "draft",
    }),

    Article.countDocuments({
      status: "review",
    }),

    Article.countDocuments({
      status: "published",
      isFeatured: true,
    }),

    Category.countDocuments(),

    Report.countDocuments({
      status: {
        $in: [
          "pending",
          "investigating",
        ],
      },
    }),
  ]);

  return {
    users,
    articles,
    published,
    drafts,
    review,
    featured,
    categories,
    reports,
  };
}