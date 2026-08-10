import { createArticle, getArticles } from "@/lib/articles";


export async function GET() {
  const articles = await getArticles();
  return Response.json(articles,{status:200});
}

export async function POST(request: Request) {
  try{
    const body = await request.json();

    if(!body?.title){
      return Response.json(
        {
          message: "Title is required",
        },
        {
          status: 400,
        }
      );
    }

    const article = await createArticle(body);

    return Response.json(article,{
      status:201,
    });
  }catch(error){
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