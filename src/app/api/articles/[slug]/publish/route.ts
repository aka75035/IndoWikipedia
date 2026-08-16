import { NextRequest } from "next/server";

import {
  requireEditor,
} from "@/lib/auth";

import {
  publishArticle,
} from "@/lib/services/article.service";

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
      await requireEditor();

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
     * Only editors and admins
     * can publish.
     */
    if (
      auth.user.role !== "editor" &&
      auth.user.role !== "admin"
    ) {
      return Response.json(
        {
          success: false,
          message:
            "You are not allowed to publish articles",
        },
        {
          status: 403,
        }
      );
    }

    const { slug } = await params;

    const article =
      await publishArticle(
        slug,
        auth.user._id.toString()
      );

    return Response.json(
      {
        success: true,
        message:
          "Article published successfully",
        article,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Publish article error:",
      error
    );

    if (error instanceof Error) {
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
          "cannot be published"
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
          "Failed to publish article",
      },
      {
        status: 500,
      }
    );
  }
}