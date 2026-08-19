import { notFound } from "next/navigation";

import {
  getPublishedArticle,
} from "@/lib/services/article.service";

import ArticlePage from "@/components/Article/ArticlePage";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

type ArticleCategory = {
  _id: string | { toString(): string };
  name: string;
  slug: string;
};

export default async function ArticleRoute({
  params,
}: Props) {
  const { slug } = await params;

  const article =
    await getPublishedArticle(slug);

  if (
    !article ||
    !article.currentRevision
  ) {
    notFound();
  }

  const revision =
    article.currentRevision;

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