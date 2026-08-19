import { NextRequest, NextResponse } from "next/server";

import {
  getArticlesByCategory,
} from "@/lib/services/category.service";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { slug } = await params;

    const articles = await getArticlesByCategory(slug);

    return NextResponse.json(
      {
        success: true,
        articles,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Get category articles error:",
      error
    );

    if (
      error instanceof Error &&
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

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to get category articles",
      },
      {
        status: 500,
      }
    );
  }
}