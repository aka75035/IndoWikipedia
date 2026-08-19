import { NextRequest } from "next/server";

import { requireEditor } from "@/lib/auth";

import {
  requestArticleChanges,
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

    const { slug } = await params;

    const article =
      await requestArticleChanges(
        slug,
        auth.user._id.toString(),
        auth.user.role
      );

    return Response.json(
      {
        success: true,
        message:
          "Article sent back for changes",
        article,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Request changes error:",
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
          "cannot be sent back"
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
          "Failed to request changes",
      },
      {
        status: 500,
      }
    );
  }
}