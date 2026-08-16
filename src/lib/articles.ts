import { connectDB } from "./mongodb";
import Article from "@/models/Article";

import {
  type CreateArticleInput,
  type UpdateArticleInput,
} from "@/lib/validations/article";

const ARTICLES_PER_PAGE = 10;

/**
 * Get paginated articles
 */
export async function getArticles(page?: number) {
  await connectDB();

  const total = await Article.countDocuments();

  const totalPages = Math.max(
    Math.ceil(total / ARTICLES_PER_PAGE),
    1
  );

  const pageNo = Math.min(
    Number.isInteger(page)
      ? Math.max(page || 1, 1)
      : 1,
    totalPages
  );

  const skip =
    (pageNo - 1) * ARTICLES_PER_PAGE;

  const articles = await Article.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(ARTICLES_PER_PAGE);

  return {
    articles,
    total,
    page: pageNo,
    totalPages,
  };
}

/**
 * Get one article by slug
 */
export async function getArticle(slug: string) {
  await connectDB();

  return Article.findOne({
    slug: slug.trim().toLowerCase(),
  }).populate(
    "author",
    "name email"
  );
}

/**
 * Create article
 */
export async function createArticle(
  body: CreateArticleInput,
  authorId: string
) {
  await connectDB();

  return Article.create({
    ...body,
    author: authorId,
  });
}

/**
 * Update article
 */
export async function updateArticle(
  slug: string,
  body: UpdateArticleInput
) {
  await connectDB();

  return Article.findOneAndUpdate(
    {
      slug: slug.trim().toLowerCase(),
    },
    body,
    {
      new: true,
      runValidators: true,
    }
  ).populate(
    "author",
    "name email"
  );
}

/**
 * Delete article
 */
export async function deleteArticle(
  slug: string
) {
  await connectDB();

  return Article.findOneAndDelete({
    slug: slug.trim().toLowerCase(),
  });
}

/**
 * Search articles
 */
export async function searchArticles(
  query?: string,
  category?: string,
  page?: number
) {
  await connectDB();

  const filter: Record<string, unknown> = {};

  /*
   * Categories are now stored as an array:
   *
   * categories: [
   *   "History",
   *   "Indian History"
   * ]
   */
  const categories = category
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (categories?.length) {
    filter.categories = {
      $in: categories,
    };
  }

  /*
   * Search title, short description,
   * lead and category names.
   */
  if (query?.trim()) {
    const searchQuery = query.trim();

    filter.$or = [
      {
        title: {
          $regex: searchQuery,
          $options: "i",
        },
      },
      {
        shortDescription: {
          $regex: searchQuery,
          $options: "i",
        },
      },
      {
        lead: {
          $regex: searchQuery,
          $options: "i",
        },
      },
      {
        categories: {
          $regex: searchQuery,
          $options: "i",
        },
      },
    ];
  }

  const total =
    await Article.countDocuments(filter);

  const totalPages = Math.max(
    Math.ceil(total / ARTICLES_PER_PAGE),
    1
  );

  const pageNo = Math.min(
    Number.isInteger(page)
      ? Math.max(page || 1, 1)
      : 1,
    totalPages
  );

  const skip =
    (pageNo - 1) * ARTICLES_PER_PAGE;

  const articles = await Article.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(ARTICLES_PER_PAGE);

  return {
    articles,
    total,
    page: pageNo,
    totalPages,
  };
}

/**
 * Get all unique categories
 */
export async function getCategories() {
  await connectDB();

  return Article.distinct("categories");
}

/**
 * Get articles by category
 */
export async function getArticlesByCategory(
  categorySlug: string,
  page?: number
) {
  await connectDB();

  const category = categorySlug
    .trim()
    .replace(/-/g, " ");

  const filter = {
    categories: {
      $regex: `^${category}$`,
      $options: "i",
    },
  };

  const total =
    await Article.countDocuments(filter);

  const totalPages = Math.max(
    Math.ceil(total / ARTICLES_PER_PAGE),
    1
  );

  const pageNo = Math.min(
    Number.isInteger(page)
      ? Math.max(page || 1, 1)
      : 1,
    totalPages
  );

  const skip =
    (pageNo - 1) * ARTICLES_PER_PAGE;

  const articles = await Article.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(ARTICLES_PER_PAGE);

  return {
    articles,
    total,
    page: pageNo,
    totalPages,
  };
}

/**
 * Get number of categories
 */
export async function getCategoryCount() {
  await connectDB();

  const categories =
    await Article.distinct("categories");

  return categories.length;
}

/**
 * Get recent articles
 */
export async function getRecentArticles() {
  await connectDB();

  return Article.find({
    status: "published",
  })
    .sort({ createdAt: -1 })
    .limit(5);
}

/**
 * Get featured articles
 */
export async function getFeaturedArticles() {
  await connectDB();

  return Article.find({
    featured: true,
    status: "published",
  })
    .sort({ createdAt: -1 })
    .limit(3);
}