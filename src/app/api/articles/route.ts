import { createArticle, getArticles } from "@/lib/articles";
import { requireAdmin } from "@/lib/auth";
import { ArticleSchema } from "@/lib/validations/article";


export async function GET() {
  const articles = await getArticles();
  return Response.json(articles,{status:200});
}

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin();

    if (!auth.user) {
      return Response.json(
        {
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

    const body = await request.json();

    const result = ArticleSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          message: "Invalid article data",
          errors: result.error.issues,
        },
        {
          status: 400,
        }
      );
    }

    const article = await createArticle(result.data);

    return Response.json(article, {
      status: 201,
    });
  } catch (error) {
    const err = error as { code?: number };

    if (err.code === 11000) {
      return Response.json(
        {
          message: "An article with this slug already exists.",
        },
        {
          status: 409,
        }
      );
    }

    return Response.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}