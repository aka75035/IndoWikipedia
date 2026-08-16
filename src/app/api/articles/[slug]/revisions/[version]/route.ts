import { getCurrentUser } from "@/lib/auth";
import { canViewArticle } from "@/lib/services/article-permissions";
import {
  getArticle,
  getRevision,
} from "@/lib/services/article.service";

type Props = {
  params: Promise<{
    slug: string;
    version: string;
  }>;
};

/**
 * GET /api/articles/[slug]/revisions/[version]
 *
 * Get a specific revision.
 */
export async function GET(
  request: Request,
  { params }: Props
) {
  try {
    const {
      slug,
      version: versionParam,
    } = await params;

    /**
     * Validate version
     */
    const version = Number(
      versionParam
    );

    if (
      !Number.isInteger(version) ||
      version < 1
    ) {
      return Response.json(
        {
          success: false,
          message:
            "Invalid revision version",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * Find article
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
     * Find revision
     */
    const revision =
      await getRevision(
        article._id.toString(),
        version
      );

    if (!revision) {
      return Response.json(
        {
          success: false,
          message:
            "Revision not found",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        revision,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Get revision error:",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          "Failed to get revision",
      },
      {
        status: 500,
      }
    );
  }
}