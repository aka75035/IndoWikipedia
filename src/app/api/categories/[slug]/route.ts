import { NextRequest, NextResponse } from "next/server";

import {
  getCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/services/category.service";

import { requireAdmin } from "@/lib/auth";

import {
  UpdateCategorySchema,
} from "@/lib/validations/category";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

/**
 * GET /api/categories/[slug]
 *
 * Public endpoint.
 */
export async function GET(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { slug } = await params;

    const category =
      await getCategory(slug);

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        category,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Get category error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to get category",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * PUT /api/categories/[slug]
 *
 * Admin-only endpoint.
 */
export async function PUT(
  request: NextRequest,
  { params }: Props
) {
  try {
    const auth =
      await requireAdmin();

    if (!auth.user) {
      return NextResponse.json(
        {
          success: false,
          message:
            auth.status === 401
              ? "Unauthorized"
              : "Forbidden",
        },
        {
          status: auth.status,
        }
      );
    }

    const { slug } = await params;

    const body =
      await request.json();

    const result =
      UpdateCategorySchema.safeParse(
        body
      );

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid category data",
          errors:
            result.error.issues,
        },
        {
          status: 400,
        }
      );
    }

    const category =
      await updateCategory(
        slug,
        result.data
      );

    return NextResponse.json(
      {
        success: true,
        message:
          "Category updated successfully",
        category,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Update category error:",
      error
    );

    if (
      error instanceof Error
    ) {
      if (
        error.message ===
        "Category not found"
      ) {
        return NextResponse.json(
          {
            success: false,
            message: error.message,
          },
          {
            status: 404,
          }
        );
      }

      if (
        error.message.includes(
          "already exists"
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message: error.message,
          },
          {
            status: 409,
          }
        );
      }

      if (
        error.message ===
          "Parent category not found" ||
        error.message ===
          "A category cannot be its own parent"
      ) {
        return NextResponse.json(
          {
            success: false,
            message: error.message,
          },
          {
            status: 400,
          }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update category",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * DELETE /api/categories/[slug]
 *
 * Admin-only endpoint.
 */
export async function DELETE(
  request: NextRequest,
  { params }: Props
) {
  try {
    const auth =
      await requireAdmin();

    if (!auth.user) {
      return NextResponse.json(
        {
          success: false,
          message:
            auth.status === 401
              ? "Unauthorized"
              : "Forbidden",
        },
        {
          status: auth.status,
        }
      );
    }

    const { slug } = await params;

    const category =
      await deleteCategory(slug);

    return NextResponse.json(
      {
        success: true,
        message:
          "Category deleted successfully",
        category,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Delete category error:",
      error
    );

    if (
      error instanceof Error
    ) {
      if (
        error.message ===
        "Category not found"
      ) {
        return NextResponse.json(
          {
            success: false,
            message: error.message,
          },
          {
            status: 404,
          }
        );
      }

      if (
        error.message.includes(
          "child categories"
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message: error.message,
          },
          {
            status: 409,
          }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete category",
      },
      {
        status: 500,
      }
    );
  }
}