import { deleteArticle, getArticle, updateArticle } from "@/lib/articles";


type Props = {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(request: Request, {params}:Props){
  const {slug} = await params;
  const article = await getArticle(slug);
  if (!article) {
  return Response.json(
    { message: "Article not found" },
    { status: 404 }
  );
}
  return Response.json(
    article,
    {
      status:200,
    }
  )
}

export async function PUT(request: Request,{params}:Props){
  const {slug} = await params;
  const body = await request.json();
  const article = await updateArticle(slug, body);

  if(!article){
    return Response.json({
      message:"Article Not Found"
    },{
      status:404,
    })
  }

  return Response.json({article},{status:200})
}

export async function DELETE(request: Request,{params}:Props){
  const {slug} = await params;
  const data = await deleteArticle(slug);
  if(!data){
    return Response.json({
      message:"Article Not Found"
    },{
      status:404,
    })
  }

  return new Response(null, {
    status: 204,
  });
}
