import { NextRequest, NextResponse } from "next/server";

import {getCurrentUser, requireContributor,} from "@/lib/auth";

import { canViewArticle } from "@/lib/services/article-permissions";
import {
  getArticle,
  createRevision,
  getArticleRevisions,
} from "@/lib/services/article.service";

import {
  CreateRevisionSchema,
} from "@/lib/validations/revision";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

/**
 * GET /api/articles/[slug]/revisions
 *
 * Get revision history.
 */
export async function GET(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { slug } = await params;

    /**
     * Find article
     */
    const article = await getArticle(slug);

    if (!article) {
      return Response.json(
        {
          success: false,
          message: "Article not found",
        },
        {
          status: 404,
        }
      );
    }
    
    const user = await getCurrentUser();

    if (!canViewArticle(article, user)) {
      return Response.json(
        {
          success: false,
          message: "Article not found",
        },
        {
          status: 404,
        }
      );
    }

    /**
     * Pagination
     */
    const { searchParams } = new URL(request.url);

    const pageParam = searchParams.get("page");

    const page = pageParam ? Number(pageParam) : 1;

    /**
     * Get revisions
     */
    const result = await getArticleRevisions( article._id.toString(), page );

    return Response.json(
      {
        success: true,
        ...result,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Get revisions error:",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          "Failed to get revisions",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * POST /api/articles/[slug]/revisions
 *
 * Create a new revision.
 */
export async function POST(
  request: NextRequest,
  { params }: Props
) {
  try {
    const auth =
      await requireContributor();

    if (!auth.user) {
      return Response.json(
        {
          success: false,
          message: auth.status === 401
          ? "Authentication required"
          : "Forbidden",
        },
        {
          status: auth.status,
        }
      );
    }

    const { slug } = await params;

    const article = await getArticle(slug);

    if (!article) {
      return Response.json(
        {
          success: false,
          message: "Article not found",
        },
        {
          status: 404,
        }
      );
    }

    const body = await request.json();

    const result = CreateRevisionSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message:
            "Invalid revision data",
          errors:
            result.error.issues,
        },
        {
          status: 400,
        }
      );
    }

    const revision = await createRevision(
      article._id.toString(),
      result.data,
      auth.user._id.toString(),
      auth.user.role
    );

    return Response.json(
      {
        success: true,
        message:
          "Revision created successfully",
        revision,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Create revision error:",
      error
    );

    if (
      error instanceof Error &&
      error.message ===
        "One or more categories do not exist"
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

    if (
      error instanceof Error &&
      error.message ===
        "Article not found"
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
      error instanceof Error &&
      error.message ===
        "Invalid article ID"
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
    if (
      error instanceof Error &&
      error.message ===
        "You are not allowed to edit this article"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 403,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create revision",
      },
      {
        status: 500,
      }
    );
  }
}