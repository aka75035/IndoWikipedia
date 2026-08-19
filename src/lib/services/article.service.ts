import mongoose from "mongoose";

import { connectDB } from "../mongodb";

import Article from "@/models/Article";
import ArticleRevision from "@/models/ArticleRevision";
import User from "@/models/User";
import Category from "@/models/Category";
import type { UserRole } from "@/lib/auth";

import { type CreateArticleInput, type UpdateArticleInput,} from "@/lib/validations/article";

import {type CreateRevisionInput, } from "@/lib/validations/revision";import { compareRevisionData } from "./article-diff.service";
;

type RevisionData = Record<string, unknown>;

const ARTICLES_PER_PAGE = 10;

/**
 * Normalize slug
 */
function normalizeSlug(slug: string) {
  return slug.trim().toLowerCase();
}

/**
 * Get paginated articles
 */
export async function getArticles(page = 1) {
  await connectDB();

  const pageNo = Math.max(Number(page) || 1, 1);

  const total = await Article.countDocuments();

  const totalPages = Math.max(
    Math.ceil(total / ARTICLES_PER_PAGE),
    1
  );

  const currentPage = Math.min(
    pageNo,
    totalPages
  );

  const skip =
    (currentPage - 1) * ARTICLES_PER_PAGE;

  const articles = await Article.find()
    .populate(
      "createdBy",
      "username displayName avatar",
      
    )
    .populate(
      "currentRevision",
      "title summary"
    )
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(ARTICLES_PER_PAGE)
    .lean();

  return {
    articles,
    total,
    page: currentPage,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
}

/**
 * Get article by slug
 *
 * Includes the current revision.
 */
export async function getArticle(slug: string) {
  await connectDB();

  return Article.findOne({
    slug: normalizeSlug(slug),
  })
    .populate(
      "createdBy",
      "username displayName avatar bio"
    )
    .populate({
      path: "currentRevision",
      populate: [
        {
          path: "createdBy",
          select: "username displayName avatar",
          model: User
        },
        {
          path: "categories",
          select: "name slug description",
          model: Category
        },
      ],
    });
}

/**
 * Create article
 *
 * Creates:
 *
 * Article
 *    ↓
 * ArticleRevision #1
 *    ↓
 * Article.currentRevision
 */
export async function createArticle(
  body: CreateArticleInput,
  revisionData: CreateRevisionInput,
  userId: string
) {
  await connectDB();

  const existingArticle = await Article.findOne({slug: normalizeSlug(body.slug),});

  if (existingArticle) {
    throw new Error(
      "An article with this slug already exists"
    );
  }

  const article = await Article.create({
      title: body.title,
      slug: normalizeSlug(body.slug),
      status: "draft",
      createdBy: userId,
      currentRevision: null,
    });

  try {
    /**
     * Create first revision
     */
    const revision =
      await ArticleRevision.create({
        article: article._id,

        version: 1,

        title: revisionData.title,

        summary:
          revisionData.summary ?? "",

        sections:
          revisionData.sections ?? [],

        infobox:
          revisionData.infobox ?? null,

        references:
          revisionData.references ?? [],

        categories:
          revisionData.categories ?? [],

        editSummary:
          revisionData.editSummary ??
          "Initial creation",

        createdBy: userId,
      });

    /**
     * Set current revision
     */
    article.currentRevision =
      revision._id;

    await article.save();

    /**
     * Return complete article
     */
    return Article.findById(
      article._id
    )
      .populate(
        "createdBy",
        "username displayName avatar"
      )
      .populate({
        path: "currentRevision",
        populate: {
          path: "categories",
          select: "name slug description",
          model: Category,
        },
      });
  } catch (error) {
    /**
     * Cleanup Article if revision
     * creation fails.
     *
     * This prevents an Article without
     * its first revision.
     */
    await Article.deleteOne({
      _id: article._id,
    });

    throw error;
  }
}

/**
 * Update article metadata
 *
 * This does NOT update article content.
 *
 * Content changes should create a new revision.
 */
export async function updateArticle(
  slug: string,
  body: UpdateArticleInput
) {
  await connectDB();

  const updateData: Partial<CreateArticleInput> =
    {};

  if (body.title !== undefined) {
    updateData.title = body.title;
  }

  if (body.slug !== undefined) {
    updateData.slug = normalizeSlug(
      body.slug
    );
  }

  return Article.findOneAndUpdate(
    {
      slug: normalizeSlug(slug),
    },
    updateData,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate(
      "createdBy",
      "username displayName avatar"
    )
    .populate("currentRevision");
}

/**
 * Delete article
 *
 * For V1 this deletes the article and
 * all its revisions.
 */
export async function deleteArticle(
  slug: string
) {
  await connectDB();

  const article = await Article.findOne({
    slug: normalizeSlug(slug),
  });

  if (!article) {
    return null;
  }

  await ArticleRevision.deleteMany({
    article: article._id,
  });

  await Article.deleteOne({
    _id: article._id,
  });

  return article;
}

/**
 * Get article revisions
 */
export async function getArticleRevisions(
  articleId: string,
  page = 1
) {
  await connectDB();

  const pageNo = Math.max(
    Number(page) || 1,
    1
  );

  const total =
    await ArticleRevision.countDocuments({
      article: articleId,
    });

  const totalPages = Math.max(
    Math.ceil(total / ARTICLES_PER_PAGE),
    1
  );

  const currentPage = Math.min(
    pageNo,
    totalPages
  );

  const skip =
    (currentPage - 1) *
    ARTICLES_PER_PAGE;

  const revisions =
    await ArticleRevision.find({
      article: articleId,
    })
      .populate(
        "createdBy",
        "username displayName avatar"
      )
      .sort({ version: -1 })
      .skip(skip)
      .limit(ARTICLES_PER_PAGE)
      .lean();

  return {
    revisions,
    total,
    page: currentPage,
    totalPages,
  };
}

/**
 * Get a specific revision
 */
export async function getRevision(
  articleId: string,
  version: number
) {
  await connectDB();

  const revision = await ArticleRevision.findOne({
      article: articleId,
      version,
    })
      .populate(
        "createdBy",
        "username displayName avatar"
      )
      .populate({
        path: "categories",
        select: "name slug description",
        model: Category,
      });


  return revision;
}


export async function getLatestRevision(
  articleId: string
) {
  await connectDB();

  return ArticleRevision.findOne({
  article: articleId,
  })
    .sort({ version: -1 })
    .populate(
      "createdBy",
      "username displayName avatar"
    )
    .populate({
      path: "categories",
      select:
        "name slug description",
      model: Category,
    });
}

export async function createRevision(
  articleId: string,
  body: CreateRevisionInput,
  userId: string,
  userRole: UserRole
) {
  await connectDB();

  if (!mongoose.isValidObjectId(articleId)) {
    throw new Error("Invalid article ID");
  }

  const article =
    await Article.findById(articleId);

  if (!article) {
    throw new Error("Article not found");
  }
    /**
   * Contributors can only edit
   * their own articles.
   *
   * Editors and admins can edit
   * any article.
   */
  if (
    userRole === "contributor" &&
    article.createdBy.toString() !== userId
  ) {
    throw new Error(
      "You are not allowed to edit this article"
    );
  }

  /**
   * Get latest revision
   */
  const latestRevision =
    await ArticleRevision.findOne({
      article: article._id,
    }).sort({ version: -1 });

  const nextVersion =
    latestRevision
      ? latestRevision.version + 1
      : 1;

  /**
   * Validate categories
   */
  const categoryIds = body.categories?.length ? body.categories
    : latestRevision?.categories ?? [];

  if (categoryIds.length > 0) {
    const categories =
      await Category.find({
        _id: {
          $in: categoryIds,
        },
      }).select("_id");

    if (
      categories.length !==
      categoryIds.length
    ) {
      throw new Error(
        "One or more categories do not exist"
      );
    }
  }

  /**
   * Create revision
   */
  const revision = await ArticleRevision.create({
      article: article._id,

      version: nextVersion,

      title: body.title,

      summary:
        body.summary ?? "",

      sections: body.sections ?? [],

      infobox: body.infobox ?? null,

      references: body.references ?? [],

      categories: categoryIds,

      editSummary:
        body.editSummary ?? "",

      createdBy: userId,
    });

  try {
    /**
     * Update current revision
     */
    article.currentRevision =
      revision._id;

    if (
      article.status === "published"
    ) {
      article.status = "review";
    }

    await article.save();
  } catch (error) {
    /**
     * Cleanup revision if article update
     * fails.
     */
    await ArticleRevision.deleteOne({
      _id: revision._id,
    });

    throw error;
  }

  return ArticleRevision.findById(
    revision._id
  )
    .populate(
      "createdBy",
      "username displayName avatar"
    )
    .populate({
      path: "categories",
      select:
        "name slug description",
      model: Category,
    });
}

export async function submitArticleForReview(
  slug: string,
  userId: string,
  userRole: UserRole,
) {
  await connectDB();

  const article = await Article.findOne({
    slug: normalizeSlug(slug),
  });

  if (!article) {
    throw new Error("Article not found");
  }

  if (article.status !== "draft") {
    throw new Error(
      `Article cannot be submitted from "${article.status}" status`
    );
  }

  /**
   * Contributors can only submit
   * their own articles.
   *
   * Editors and admins can submit
   * any article.
   */
  if (
    userRole === "contributor" &&
    article.createdBy.toString() !== userId
  ) {
    throw new Error(
      "You are not allowed to submit this article"
    );
  }

  article.status = "review";

  await article.save();

  return article;
}

export async function publishArticle(
  slug: string,
) {
  await connectDB();

  const article = await Article.findOne({
    slug: normalizeSlug(slug),
  });

  if (!article) {
    throw new Error("Article not found");
  }

  if (
    article.status !== "review"
  ) {
    throw new Error(
      `Article cannot be published from "${article.status}" status`
    );
  }

  article.status = "published";
  article.publishedAt = new Date();

  await article.save();

  return Article.findById(article._id)
    .populate(
      "createdBy",
      "username displayName avatar"
    )
    .populate({
      path: "currentRevision",
      populate: [
        {
          path: "createdBy",
          select:
            "username displayName avatar",
          model: User,
        },
        {
          path: "categories",
          select:
            "name slug description",
          model: Category,
        },
      ],
    });
}

/**
 * Get a single published article by slug
 *
 * Used by the public article page.
 */
export async function getPublishedArticle(
  slug: string
) {
  await connectDB();

  return Article.findOne({
    slug: normalizeSlug(slug),
    status: "published",
  })
    .select(
      "title slug status createdBy currentRevision publishedAt updatedAt"
    )
    .populate(
      "createdBy",
      "username displayName avatar bio"
    )
    .populate({
      path: "currentRevision",
      populate: [
        {
          path: "createdBy",
          select:
            "username displayName avatar",
          model: User,
        },
        {
          path: "categories",
          select:
            "name slug description",
          model: Category,
        },
      ],
    })
    .lean();
}

export async function getPublishedArticles(
  page = 1,
  query = "",
  category = ""
) {
  await connectDB();

  const pageNo = Math.max(
    Number(page) || 1,
    1
  );

  const search = query.trim();
  const categorySlug = category
    .trim()
    .toLowerCase();

  const filter: Record<string, unknown> = {
    status: "published",
  };

  if (search) {
    filter.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
      {
        slug: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  /**
   * Filter by current revision category
   */
  if (categorySlug) {
    const categoryDoc =
      await Category.findOne({
        slug: categorySlug,
      }).select("_id");

    if (!categoryDoc) {
      return {
        articles: [],
        total: 0,
        page: 1,
        totalPages: 1,
      };
    }

    filter.currentRevision = {
      $in: await ArticleRevision.find({
        categories: categoryDoc._id,
      }).distinct("_id"),
    };
  }

  const total =
    await Article.countDocuments(filter);

  const totalPages = Math.max(
    Math.ceil(
      total / ARTICLES_PER_PAGE
    ),
    1
  );

  const currentPage = Math.min(
    pageNo,
    totalPages
  );

  const skip =
    (currentPage - 1) *
    ARTICLES_PER_PAGE;

  const articles =
    await Article.find(filter)
      .select(
        "title slug status isFeatured createdBy currentRevision publishedAt createdAt"
      )
      .populate(
        "createdBy",
        "username displayName avatar"
      )
      .populate(
        "currentRevision",
        "title summary"
      )
      .sort({
        publishedAt: -1,
      })
      .skip(skip)
      .limit(ARTICLES_PER_PAGE)
      .lean();

  const serializedArticles =
    articles.map((article) => ({
      _id: article._id.toString(),

      title: article.title,

      slug: article.slug,

      status: article.status,

      isFeatured: article.isFeatured,

      publishedAt:
        article.publishedAt?.toISOString() ??
        null,

      createdAt:
        article.createdAt?.toISOString() ??
        null,

      createdBy: article.createdBy
        ? {
            _id: article.createdBy._id.toString(),
            username:
              article.createdBy.username,
            displayName:
              article.createdBy.displayName,
            avatar:
              article.createdBy.avatar ?? null,
          }
        : null,

      currentRevision:
        article.currentRevision
          ? {
              _id: article.currentRevision._id.toString(),
              title:
                article.currentRevision.title,
              summary:
                article.currentRevision.summary,
            }
          : null,
    }));    

  return {
    articles: serializedArticles,
    total,
    page: currentPage,
    totalPages,
  };
}


export function compareRevisions(
  fromRevision: RevisionData,
  toRevision: RevisionData
) {
  return compareRevisionData(
    fromRevision,
    toRevision
  );
}

export async function getFeaturedArticles(
  limit = 6
) {
  await connectDB();

  return Article.find({
    status: "published",
    isFeatured: true,
  })
    .populate(
      "currentRevision",
      "title summary"
    )
    .sort({
      publishedAt: -1,
    })
    .limit(limit)
    .lean();
}

export async function setArticleFeatured(
  slug: string,
  isFeatured: boolean
) {
  await connectDB();

  return Article.findOneAndUpdate(
    {
      slug: normalizeSlug(slug),
    },
    {
      $set: {
        isFeatured,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate(
      "createdBy",
      "username displayName avatar"
    )
    .populate("currentRevision");
}

export async function getLatestArticles(
  limit = 6
) {
  await connectDB();

  return Article.find({
    status: "published",
  })
    .sort({
      publishedAt: -1,
      createdAt: -1,
    })
    .limit(limit)
    .populate({
      path: "currentRevision",
      select: "title summary categories",
      populate: {
        path: "categories",
        select: "name slug",
        model: Category,
      },
    })
    .lean();
}

export async function getArticleForEditing(
  slug: string
) {
  await connectDB();

  const article = await Article.findOne({
    slug: normalizeSlug(slug),
  })
    .populate({
      path: "currentRevision",
      populate: {
        path: "categories",
        select: "name slug description",
        model: Category,
      },
    })
    .populate(
      "createdBy",
      "username displayName avatar"
    )
    .lean();

  return article;
}

export async function requestArticleChanges(
  slug: string,
  userId: string,
  role: string
) {
  await connectDB();

  const article = await Article.findOne({
    slug: normalizeSlug(slug),
  });

  if (!article) {
    throw new Error("Article not found");
  }

  if (
    role !== "editor" &&
    role !== "admin"
  ) {
    throw new Error(
      "You are not allowed to request changes"
    );
  }

  if (article.status !== "review") {
    throw new Error(
      `Article cannot be sent back from "${article.status}" status`
    );
  }

  article.status = "draft";

  await article.save();

  return article;
}