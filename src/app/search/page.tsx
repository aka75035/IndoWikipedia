import ArticleCard from "@/components/Article/ArticleCard";
import { searchArticles } from "@/lib/articles";
import Link from "next/link";

type Props = {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
};

export default async function SearchPage({
  searchParams,
}: Props) {
  const { q, page } = await searchParams;

  const currentPage = Number(page) || 1;

  const {
    articles: results,
    total,
    totalPages,
  } = await searchArticles(q ?? "", undefined, currentPage);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Search
          </p>

          <h1 className="mt-1 font-serif text-3xl font-semibold text-slate-900">
            Search results
          </h1>

          {q && (
            <p className="mt-2 text-slate-600">
              Results for{" "}
              <span className="font-medium text-slate-900">
                "{q}"
              </span>
            </p>
          )}

          <p className="mt-1 text-sm text-slate-500">
            {total} {total === 1 ? "article" : "articles"} found
          </p>
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <h2 className="font-serif text-2xl font-semibold text-slate-900">
              No articles found
            </h2>

            <p className="mt-2 text-slate-600">
              Try searching with a different keyword.
            </p>

            <Link
              href="/"
              className="mt-5 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              Return to Home →
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((article) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={`/search?q=${encodeURIComponent(
                      q ?? ""
                    )}&page=${currentPage - 1}`}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    ← Previous
                  </Link>
                )}

                <span className="px-4 py-2 text-sm text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>

                {currentPage < totalPages && (
                  <Link
                    href={`/search?q=${encodeURIComponent(
                      q ?? ""
                    )}&page=${currentPage + 1}`}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Next →
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}