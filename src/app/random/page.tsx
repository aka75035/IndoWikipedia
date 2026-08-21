import { notFound } from "next/navigation";

import {
  getRandomPublishedArticle,
} from "@/lib/services/article.service";

import ArticlePage from "@/components/Article/ArticlePage";
import { Metadata } from "next";

type ArticleCategory = {
  _id: string | { toString(): string };
  name: string;
  slug: string;
};
export const metadata: Metadata = {
  title: "Random Article",
};

export default async function RandomArticleRoute() {
  const article = await getRandomPublishedArticle();

  if (!article || !article.currentRevision) {
    notFound();
  }

  const revision = article.currentRevision;

  const categories = 
    (revision.categories as ArticleCategory[] | undefined)?.map(
      (category) => ({
        _id: category._id.toString(),
        name: category.name,
        slug: category.slug,
      })
    ) ?? [];
  
    
  return (
    <ArticlePage
      title={revision.title}
      summary={revision.summary ?? ""}
      categories={categories}
      sections={revision.sections ?? []}
      infobox={revision.infobox ?? null}
      references={revision.references ?? []}
      updatedAt={article.updatedAt}
      author={article.createdBy}
      mode="public"
    />
  );
}