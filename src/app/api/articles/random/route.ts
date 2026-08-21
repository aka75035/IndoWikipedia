import { connectDB } from "@/lib/mongodb";
import Article from "@/models/Article";

export async function GET() {
  try {
    await connectDB();

    const articles = await Article.aggregate([
      { $sample: { size: 1 } }
    ]);

    if (!articles.length) {
      return Response.json(
        { message: "No articles found" },
        { status: 404 }
      );
    }

    return Response.json({
      article: articles[0],
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to get random article" },
      { status: 500 }
    );
  }
}