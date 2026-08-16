import {
  getArticle,
  updateArticle,
  deleteArticle,
} from "@/lib/services/article.service";

import { requireAdmin } from "@/lib/auth";

import { UpdateArticleSchema } from "@/lib/validations/article";
import { getCurrentUser } from "@/lib/auth";
import { canViewArticle } from "@/lib/services/article-permissions";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

/**
 * GET /api/articles/[slug]
 *
 * Public endpoint.
 *
 * Returns the article together with
 * its current revision.
 */
export async function GET(
  request: Request,
  { params }: Props
) {
  try {
    const { slug } = await params;

    /**
     * Get article first
     */
    const article =
      await getArticle(slug);

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

    /**
     * Get logged-in user.
     * Returns null for anonymous visitors.
     */
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
    
    return Response.json(
      {
        success: true,
        article,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Get article error:",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          "Failed to get article",
      },
      {
        status: 500,
      }
    );
  }
}


 //Admin-only.
 
 // Updates article metadata only:
 
export async function PUT(
  request: Request,
  { params }: Props
) {
  try {
    /**
     * Authentication + authorization
     */
    const auth = await requireAdmin();

    if (!auth.user) {
      return Response.json(
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
     * Get current slug
     */
    const { slug } = await params;

    /**
     * Parse body
     */
    const body = await request.json();

    /**
     * Validate
     */
    const result =
      UpdateArticleSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: "Invalid article data",
          errors: result.error.issues,
        },
        {
          status: 400,
        }
      );
    }

    /**
     * Update metadata
     */
    const article =
      await updateArticle(
        slug,
        result.data
      );

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

    return Response.json(
      {
        success: true,
        message:
          "Article updated successfully",
        article,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    const err = error as {
      code?: number;
    };

    /**
     * Duplicate slug
     */
    if (err.code === 11000) {
      return Response.json(
        {
          success: false,
          message:
            "An article with this slug already exists.",
        },
        {
          status: 409,
        }
      );
    }

    console.error(
      "Update article error:",
      error
    );

    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * DELETE /api/articles/[slug]
 *
 * Admin-only.
 */
export async function DELETE(
  request: Request,
  { params }: Props
) {
  try {
    /**
     * Authentication + authorization
     */
    const auth = await requireAdmin();

    if (!auth.user) {
      return Response.json(
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
     * Get slug
     */
    const { slug } = await params;

    /**
     * Delete article
     */
    const article =
      await deleteArticle(slug);

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

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    console.error(
      "Delete article error:",
      error
    );

    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}