import Article from "@/models/Article";
import ArticleRevision from "@/models/ArticleRevision";
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

export async function getEditorReviewQueue() {
  await connectDB();

  return Article.find({
    status: "review",
  })
    .sort({
      updatedAt: -1,
    })
    .populate(
      "createdBy",
      "username displayName avatar"
    )
    .populate({
      path: "currentRevision",
      select: "version title summary createdAt createdBy",
      model: ArticleRevision,
      populate: {
        path: "createdBy",
        select: "username displayName avatar",
        model: User,
      },
    })
    .select(
      "title slug status currentRevision createdBy updatedAt"
    )
    .lean();
}