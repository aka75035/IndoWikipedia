import { NextRequest } from "next/server";

import { requireContributor } from "@/lib/auth";

import { submitArticleForReview, } from "@/lib/services/article.service";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function POST(
  request: NextRequest,
  { params }: Props
) {
  try {
    /**
     * Authentication
     */
    const auth =
      await requireContributor();

    if (!auth.user) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /**
     * Get slug
     */
    const { slug } = await params;

    /**
     * Submit article
     */
    const article =
      await submitArticleForReview(
        slug,
        auth.user._id.toString(),
        auth.user.role,
      );

    return Response.json(
      {
        success: true,
        message:
          "Article submitted for review",
        article,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Submit article error:",
      error
    );

    if (
      error instanceof Error
    ) {
      if (
        error.message ===
        "Article not found"
      ) {
        return Response.json(
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
          "not allowed"
        )
      ) {
        return Response.json(
          {
            success: false,
            message: error.message,
          },
          {
            status: 403,
          }
        );
      }

      if (
        error.message.includes(
          "cannot be submitted"
        )
      ) {
        return Response.json(
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

    return Response.json(
      {
        success: false,
        message:
          "Failed to submit article",
      },
      {
        status: 500,
      }
    );
  }
}