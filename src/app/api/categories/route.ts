import { NextRequest, NextResponse } from "next/server";

import {
  getCategories,
  createCategory,
} from "@/lib/services/category.service";

import { requireAdmin } from "@/lib/auth";

import {
  CreateCategorySchema,
} from "@/lib/validations/category";

/**
 * GET /api/categories
 *
 * Public endpoint.
 */
export async function GET() {
  try {
    const categories =
      await getCategories();

    return NextResponse.json(
      {
        success: true,
        categories,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Get categories error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to get categories",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * POST /api/categories
 *
 * Admin-only endpoint.
 */
export async function POST(
  request: NextRequest
) {
  try {
    /**
     * Authentication + authorization
     */
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

    /**
     * Parse body
     */
    const body =
      await request.json();

    /**
     * Validate
     */
    const result =
      CreateCategorySchema.safeParse(
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

    /**
     * Create category
     */
    const category = await createCategory(
        result.data,
        auth.user._id.toString()
      );

    return NextResponse.json(
      {
        success: true,
        message:
          "Category created successfully",
        category,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Create category error:",
      error
    );

    if (
      error instanceof Error
    ) {
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
        "Parent category not found"
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
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create category",
      },
      {
        status: 500,
      }
    );
  }
}