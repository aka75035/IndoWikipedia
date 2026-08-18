import Category from "@/models/Category";
import Article from "@/models/Article";
import ArticleRevision from "@/models/ArticleRevision";

import { CreateCategoryInput, UpdateCategoryInput, } from "@/lib/validations/category";

import { connectDB } from "../mongodb";

/**
 * Normalize category slug
 */
function normalizeSlug(slug: string) {
  return slug.trim().toLowerCase();
}

/**
 * Get all categories
 */
export async function getCategories() {
  await connectDB();

  return Category.find()
    .sort({ name: 1 })
    .populate(
      "parent",
      "name slug"
    )
    .populate(
      "createdBy",
      "username displayName"
    );
}

/**
 * Get category by slug
 */
export async function getCategory(
  slug: string
) {
  await connectDB();

  return Category.findOne({
    slug: normalizeSlug(slug),
  })
    .populate(
      "parent",
      "name slug"
    )
    .populate(
      "createdBy",
      "username displayName"
    );
}

/**
 * Create category
 */
export async function createCategory(
  body: CreateCategoryInput,
  userId: string
) {
  await connectDB();

  const slug = normalizeSlug(
    body.slug
  );

  /**
   * Check duplicate slug
   */
  const existingCategory =
    await Category.findOne({
      slug,
    });

  if (existingCategory) {
    throw new Error(
      "A category with this slug already exists"
    );
  }

  /**
   * Validate parent
   */
  if (body.parent) {
    const parent =
      await Category.findById(
        body.parent
      );

    if (!parent) {
      throw new Error(
        "Parent category not found"
      );
    }
  }

  /**
   * Create category
   */
  const category =
    await Category.create({
      name: body.name,
      slug,
      description:
        body.description ?? "",
      parent:
        body.parent ?? null,
      image:
        body.image ?? null,
      createdBy: userId,
    });

  return Category.findById(
    category._id
  )
    .populate(
      "parent",
      "name slug"
    )
    .populate(
      "createdBy",
      "username displayName"
    );
}

/**
 * Update category
 */
export async function updateCategory(
  slug: string,
  body: UpdateCategoryInput
) {
  await connectDB();

  const category =
    await Category.findOne({
      slug: normalizeSlug(slug),
    });

  if (!category) {
    throw new Error(
      "Category not found"
    );
  }

  /**
   * If slug is being changed,
   * check whether it already exists.
   */
  if (body.slug) {
    const newSlug =
      normalizeSlug(body.slug);

    if (
      newSlug !== category.slug
    ) {
      const existingCategory =
        await Category.findOne({
          slug: newSlug,
        });

      if (existingCategory) {
        throw new Error(
          "A category with this slug already exists"
        );
      }

      category.slug = newSlug;
    }
  }

  /**
   * Update allowed fields
   */
  if (body.name !== undefined) {
    category.name = body.name;
  }

  if (
    body.description !== undefined
  ) {
    category.description =
      body.description;
  }

  if (body.image !== undefined) {
    category.image = body.image;
  }

  if (body.parent !== undefined) {
    /**
     * Prevent category from being
     * its own parent.
     */
    if (
      body.parent ===
      category._id.toString()
    ) {
      throw new Error(
        "A category cannot be its own parent"
      );
    }

    if (body.parent) {
      const parent =
        await Category.findById(
          body.parent
        );

      if (!parent) {
        throw new Error(
          "Parent category not found"
        );
      }
    }

    category.parent =
      body.parent ?? null;
  }

  await category.save();

  return Category.findById(
    category._id
  )
    .populate(
      "parent",
      "name slug"
    )
    .populate(
      "createdBy",
      "username displayName"
    );
}

/**
 * Delete category
 */
export async function deleteCategory(
  slug: string
) {
  await connectDB();

  const category =
    await Category.findOne({
      slug: normalizeSlug(slug),
    });

  if (!category) {
    throw new Error(
      "Category not found"
    );
  }

  /**
   * Check child categories.
   */
  const childCategory =
    await Category.findOne({
      parent: category._id,
    });

  if (childCategory) {
    throw new Error(
      "Cannot delete a category that has child categories"
    );
  }

  await Category.deleteOne({
    _id: category._id,
  });

  return category;
}

export async function getArticlesByCategory(
  slug: string
) {
  await connectDB();

  const category = await Category.findOne({
    slug: normalizeSlug(slug),
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const revisions =
    await ArticleRevision.find({
      categories: category._id,
    }).select("article");

  const articleIds = revisions.map(
    (revision) => revision.article
  );

  if (!articleIds.length) {
    return [];
  }

  return Article.find({
    _id: { $in: articleIds },
    status: "published",
  })
    .sort({ publishedAt: -1 })
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
}

export async function getPopularCategories( limit = 8 ) {

  await connectDB();


  const popularCategories = await Article.aggregate([
      {
        $match: {
          status: "published",
        },
      },

      {
        $lookup: {
          from: "articlerevisions",
          localField: "currentRevision",
          foreignField: "_id",
          as: "revision",
        },
      },

      {
        $unwind: "$revision",
      },

      {
        $unwind: "$revision.categories",
      },

      {
        $group: {
          _id: "$revision.categories",
          articleCount: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          articleCount: -1,
        },
      },

      {
        $limit: limit,
      },

      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },

      {
        $unwind: "$category",
      },

      {
        $project: {
          _id: "$category._id",
          name: "$category.name",
          slug: "$category.slug",
          description:
            "$category.description",
          articleCount: 1,
        },
      },
    ]);

  return popularCategories;
}