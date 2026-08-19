import Article from "@/models/Article";
import { connectDB } from "@/lib/mongodb";

export async function getContributorStats(
  userId: string
) {
  await connectDB();

  const [
    total,
    drafts,
    review,
    published,
  ] = await Promise.all([
    Article.countDocuments({
      createdBy: userId,
    }),

    Article.countDocuments({
      createdBy: userId,
      status: "draft",
    }),

    Article.countDocuments({
      createdBy: userId,
      status: "review",
    }),

    Article.countDocuments({
      createdBy: userId,
      status: "published",
    }),
  ]);

  return {
    total,
    drafts,
    review,
    published,
  };
}

export async function getContributorArticles(
  userId: string
) {
  await connectDB();

  return Article.find({
    createdBy: userId,
  })
    .sort({
      updatedAt: -1,
    })
    .populate({
      path: "currentRevision",
      select: "version title summary",
    })
    .select(
      "title slug status currentRevision updatedAt publishedAt"
    )
    .lean();
}