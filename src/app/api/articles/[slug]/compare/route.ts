import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { compareRevisions, getArticle, getRevision, } from "@/lib/services/article.service";
import { canViewArticle } from "@/lib/services/article-permissions";

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

    /**
     * Get versions from query string
     *
     * ?from=6&to=7
     */
    const { searchParams } = new URL(request.url);

    const fromParam = searchParams.get("from");

    const toParam = searchParams.get("to");

    /**
     * Both versions are required
     */
    if (!fromParam || !toParam) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Both from and to revisions are required",
        },
        {
          status: 400,
        }
      );
    }

    const from = Number(fromParam);
    const to = Number(toParam);

    /**
     * Validate versions
     */
    if (
      !Number.isInteger(from) ||
      !Number.isInteger(to) ||
      from < 1 ||
      to < 1
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Revision versions must be positive integers",
        },
        {
          status: 400,
        }
      );
    }

    if (from === to) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cannot compare a revision with itself",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * Find article
     */
    const article = await getArticle(slug);

    if (!article) {
      return NextResponse.json(
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
     * Visibility check
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

    /**
     * Get both revisions
     */
    const [
      fromRevision,
      toRevision,
    ] = await Promise.all([
      getRevision(
        article._id.toString(),
        from
      ),
      getRevision(
        article._id.toString(),
        to
      ),
    ]);

    /**
     * Make sure both exist
     */
    if (!fromRevision) {
      return NextResponse.json(
        {
          success: false,
          message:
            `Revision ${from} not found`,
        },
        {
          status: 404,
        }
      );
    }

    if (!toRevision) {
      return NextResponse.json(
        {
          success: false,
          message:
            `Revision ${to} not found`,
        },
        {
          status: 404,
        }
      );
    }

    /**
     * Stage 1 response
     *
     * Actual diff comes next.
     */
    const changes = compareRevisions(
        fromRevision,
        toRevision
      );

    return NextResponse.json(
      {
        success: true,

        article: {
          id: article._id,
          slug: article.slug,
        },

        from: fromRevision.version,
        to: toRevision.version,

        changes,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Compare revisions error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to compare revisions",
      },
      {
        status: 500,
      }
    );
  }
}