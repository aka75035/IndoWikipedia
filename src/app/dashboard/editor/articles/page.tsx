import { redirect } from "next/navigation";

import { requireEditor } from "@/lib/auth";

import { getPublishedArticles,} from "@/lib/services/article.service";

import PublishedArticles from "@/components/Dashboard/Editor/PublishedArticles/PublishedArticles";
import { Metadata } from "next";

type Props = {
  searchParams: Promise<{
    page?: string;
    q?: string;
    category?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Published Articles",
  description:
    "Manage published articles on IndoWikipedia.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PublishedArticlesPage({
  searchParams,
}: Props) {
  const auth = await requireEditor();

  if (auth.status !== 200 || !auth.user) {
    redirect("/login");
  }

  const params = await searchParams;

  const page =
    Number(params.page) || 1;

  const query =
    params.q?.trim() || "";

  const category =
    params.category?.trim() || "";

  const result =
    await getPublishedArticles(
      page,
      query,
      category
    );

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PublishedArticles
        articles={result.articles}
        page={result.page}
        total={result.total}
        totalPages={result.totalPages}
        query={query}
        category={category}
      />
    </main>
  );
}