import { NextRequest, NextResponse } from "next/server";

import { requireEditor } from "@/lib/auth";
import { setArticleFeatured } from "@/lib/services/article.service";

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
    const auth = await requireEditor();

    if (auth.status !== 200) {
      return NextResponse.json(
        {
          error:
            auth.status === 401
              ? "Authentication required"
              : "You are not allowed to perform this action",
        },
        {
          status: auth.status,
        }
      );
    }

    const { slug } = await params;

    const body = await request.json();

    if (
      typeof body.isFeatured !==
      "boolean"
    ) {
      return NextResponse.json(
        {
          error:
            "isFeatured must be a boolean",
        },
        {
          status: 400,
        }
      );
    }

    const article =
      await setArticleFeatured(
        slug,
        body.isFeatured
      );

    if (!article) {
      return NextResponse.json(
        {
          error: "Article not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        message: body.isFeatured
          ? "Article featured successfully"
          : "Article removed from featured",
        article,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Featured article error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update featured status",
      },
      {
        status: 500,
      }
    );
  }
}