import { NextRequest, NextResponse } from "next/server";

import {CreateArticleSchema,} from "@/lib/validations/article";

import {CreateRevisionSchema,} from "@/lib/validations/revision";

import {createArticle,} from "@/lib/services/article.service";

import {requireContributor} from "@/lib/auth";

import { getPublishedArticles } from "@/lib/services/article.service";

export async function GET(
  request: NextRequest
) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q") ?? "";

    const category = searchParams.get("category") ?? "";

    const pageParam = searchParams.get("page");

    const page = pageParam
      ? Number(pageParam)
      : 1;

    if (
      !Number.isInteger(page) ||
      page < 1
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Page must be a positive integer",
        },
        {
          status: 400,
        }
      );
    }

    const result = await getPublishedArticles(page,query,category);

    return NextResponse.json(
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
      "Get published articles error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to get articles",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {

    // 1. Authentication
    
    const auth =
      await requireContributor();

    if (!auth.user) {
      return NextResponse.json(
        {
          success: false,
          message:
            auth.status === 403
              ? "Forbidden"
              : "Authentication required",
        },
        {
          status: auth.status,
        }
      );
    }

    const body = await request.json();

    const articleResult = CreateArticleSchema.safeParse(body.article);

    if (!articleResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid article data",
          errors:
            articleResult.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    /**
     * 4. Validate revision
     */
    const revisionResult = CreateRevisionSchema.safeParse(body.revision);

    if (!revisionResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid revision data",
          errors:
            revisionResult.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    /**
     * 5. Create article
     */
    const article = await createArticle(
        articleResult.data,
        revisionResult.data,
        auth.user._id.toString()
      );

    /**
     * 6. Response
     */
    return NextResponse.json(
      {
        success: true,
        message:
          "Article created successfully",
        article,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
  console.error("CREATE ARTICLE ERROR:", error);

  return Response.json(
    {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create article",
    },
    {
      status: 500,
    }
  );
}
}