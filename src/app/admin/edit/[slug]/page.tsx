import { notFound } from "next/navigation";
import { getArticle } from "@/lib/articles";
import EditArticleForm from "./EditArticleForm";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditArticlePage({ params }: Props) {
  const { slug } = await params;

  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-8">
        Edit Article
      </h1>

      <EditArticleForm article={JSON.parse(JSON.stringify(article))} />
    </div>
  );
}