import { getArticle } from "@/lib/articles";
import { notFound } from "next/navigation";
import EditArticleForm from "./EditArticleForm";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EditArticlePage({
  params,
}: Props) {
  const { slug } = await params;

  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-600">
          Administration
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Edit Article
        </h1>

        <p className="mt-2 text-slate-500">
          Update the encyclopedic information,
          sections, references, and publishing
          settings.
        </p>
      </div>

      <EditArticleForm
        article={JSON.parse(
          JSON.stringify(article)
        )}
      />
    </div>
  );
}