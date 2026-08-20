import Link from "next/link";

type PublishedArticle = {
  _id: string | { toString(): string };
  title: string;
  slug: string;
  publishedAt?: Date | string | null;
  createdAt?: Date | string | null;

  createdBy?: {
    username?: string;
    displayName?: string;
  } | null;

  currentRevision?: {
    title?: string;
    summary?: string;
  } | null;
};

type Props = {
  articles: PublishedArticle[];
  page: number;
  total: number;
  totalPages: number;
  query?: string;
  category?: string;
};

function formatDate(
  date?: Date | string | null
) {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

export default function PublishedArticles({
  articles,
  page,
  total,
  totalPages,
  query = "",
  category = "",
}: Props) {
  function createPageUrl(
    pageNumber: number
  ) {
    const params = new URLSearchParams();

    if (query) {
      params.set("q", query);
    }

    if (category) {
      params.set("category", category);
    }

    params.set(
      "page",
      pageNumber.toString()
    );

    return `/dashboard/editor/articles?${params.toString()}`;
  }

  return (
    <section>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">
            Content Management
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Published Articles
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage articles currently published
            on the platform.
          </p>
        </div>

        <span className="w-fit rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-700">
          {total} published
        </span>
      </div>

      {/* Search */}
      <form
        method="GET"
        className="mb-6 rounded-xl border border-slate-200 bg-white p-4"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search articles..."
            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {category && (
            <input
              type="hidden"
              name="category"
              value={category}
            />
          )}

          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Search
          </button>

          {query && (
            <Link
              href="/dashboard/editor/articles"
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Clear
            </Link>
          )}
        </div>
      </form>

      {/* Empty state */}
      {articles.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            No published articles found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Try changing your search query.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {/* Desktop table header */}
          <div className="hidden border-b border-slate-200 bg-slate-50 px-6 py-3 md:grid md:grid-cols-[minmax(0,1fr)_180px_140px_120px] md:items-center md:gap-6">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Article
            </span>

            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Author
            </span>

            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Published
            </span>

            <span />
          </div>

          {/* Articles */}
          <div className="divide-y divide-slate-200">
            {articles.map(
              (article) => {
                const author =
                  article.createdBy
                    ?.displayName ||
                  article.createdBy
                    ?.username ||
                  "Unknown";

                return (
                  <article
                    key={article._id.toString()}
                    className="px-5 py-5 transition hover:bg-slate-50 sm:px-6"
                  >
                    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px_140px_120px] md:items-center md:gap-6">
                      {/* Article */}
                      <div className="min-w-0">
                        <Link
                          href={`/articles/${article.slug}`}
                          className="text-base font-semibold text-slate-900 hover:text-blue-600"
                        >
                          {article.title}
                        </Link>

                        <p className="mt-1 truncate text-sm text-slate-500">
                          /{article.slug}
                        </p>

                        {article
                          .currentRevision
                          ?.summary && (
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                            {
                              article
                                .currentRevision
                                .summary
                            }
                          </p>
                        )}

                        <p className="mt-2 text-xs text-slate-400 md:hidden">
                          Published{" "}
                          {formatDate(
                            article.publishedAt
                          )}
                        </p>
                      </div>

                      {/* Author */}
                      <div className="text-sm text-slate-600">
                        <span className="md:hidden">
                          Author:{" "}
                        </span>

                        {author}
                      </div>

                      {/* Published */}
                      <div className="text-sm text-slate-500">
                        {formatDate(
                          article.publishedAt
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link
                          href={`/articles/${article.slug}`}
                          target="_blank"
                          className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white"
                        >
                          View
                        </Link>

                        <Link
                          href={`/dashboard/editor/articles/${article.slug}`}
                          className="inline-flex flex-1 items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
                        >
                          Manage
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            {page > 1 && (
              <Link
                href={createPageUrl(
                  page - 1
                )}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Previous
              </Link>
            )}

            {page < totalPages && (
              <Link
                href={createPageUrl(
                  page + 1
                )}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </section>
  );
}