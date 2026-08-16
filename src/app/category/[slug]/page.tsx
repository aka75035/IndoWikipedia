import ArticleCard from "@/components/Article/ArticleCard";
import { getArticlesByCategory } from "@/lib/articles";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{
    slug: string;
  }>;

  searchParams: Promise<{
    page?: string;
  }>;
};

function formatCategory(slug: string) {
  return slug
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const category = formatCategory(slug);

  return {
    title: `${category} | IndoWikipedia`,
    description: `Explore ${category} articles on IndoWikipedia.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const { page } = await searchParams;

  const currentPage = Number(page) || 1;

  const {
    articles,
    total,
    totalPages,
  } = await getArticlesByCategory(
    slug,
    currentPage
  );

  if (total === 0) {
    notFound();
  }

  const category = formatCategory(slug);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Category
          </p>

          <h1 className="mt-1 font-serif text-4xl font-semibold text-slate-900">
            {category}
          </h1>

          <p className="mt-2 text-slate-600">
            Explore articles about{" "}
            {category.toLowerCase()}.
          </p>

          <p className="mt-2 text-sm text-slate-500">
            {total}{" "}
            {total === 1 ? "article" : "articles"}
          </p>
        </div>

        {/* Articles */}
        {articles.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-gray-500">
              No articles found on this page.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-3">
            {currentPage > 1 && (
              <Link
                href={`/category/${slug}?page=${
                  currentPage - 1
                }`}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                ← Previous
              </Link>
            )}

            <span className="px-4 py-2 text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </span>

            {currentPage < totalPages && (
              <Link
                href={`/category/${slug}?page=${
                  currentPage + 1
                }`}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}