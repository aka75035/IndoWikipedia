import Link from "next/link";

type ReviewArticle = {
  _id: string | { toString(): string };
  slug: string;
  title: string;
  updatedAt: Date | string;

  createdBy?: {
    username?: string;
    displayName?: string;
  } | null;

  currentRevision?: {
    version?: number;
  } | null;
};

type Props = {
  articles: ReviewArticle[];
};

function formatDate(
  date: Date | string
) {
  return new Date(date).toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

export default function ReviewQueue({
  articles,
}: Props) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Review Queue
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Articles waiting for editorial review.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
            {articles.length} pending
          </span>

          <Link
            href="/dashboard/editor/review"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View all →
          </Link>
        </div>
      </div>

      {/* Empty state */}
      {articles.length === 0 ? (
        <div className="p-10 text-center">
          <h3 className="text-sm font-semibold text-slate-800">
            Review queue is empty
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            There are no articles waiting
            for review.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-200">
          {articles.map((article) => {
            const author =
              article.createdBy
                ?.displayName ||
              article.createdBy
                ?.username ||
              "Unknown";

            const revision =
              article.currentRevision
                ?.version ?? 0;

            return (
              <div
                key={article._id.toString()}
                className="p-6 transition hover:bg-slate-50"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  {/* Article information */}
                  <div className="min-w-0">
                    <Link
                      href={`/dashboard/editor/review/${article.slug}`}
                      className="text-lg font-semibold text-slate-900 hover:text-blue-600"
                    >
                      {article.title}
                    </Link>

                    <p className="mt-1 text-sm text-slate-500">
                      /{article.slug}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                      <span>
                        Revision {revision}
                      </span>

                      <span>
                        Contributor: {author}
                      </span>

                      <span>
                        Updated{" "}
                        {formatDate(
                          article.updatedAt
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                      Review
                    </span>

                    <Link
                      href={`/dashboard/editor/review/${article.slug}`}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      Review Article
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}