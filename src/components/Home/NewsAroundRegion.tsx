import Link from "next/link";
import { getLatestArticles } from "@/lib/services/article.service";

export default async function NewsAroundRegion() {
  const articles = await getLatestArticles(6);

  return (
    <section className="py-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Latest knowledge
          </p>

          <h2 className="mt-1 font-serif text-3xl font-semibold text-slate-900">
            News Around the Region
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Recently published articles from across India.
          </p>
        </div>

        <Link
          href="/articles"
          className="hidden text-sm font-medium text-blue-600 hover:underline sm:block"
        >
          View all →
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-sm text-slate-500">
            No recent articles yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {articles.map((article) => (
            <Link
              key={article._id.toString()}
              href={`/articles/${article.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:bg-blue-50/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-serif text-xl font-semibold text-slate-900 group-hover:text-blue-600">
                    {article.currentRevision?.title ??
                      article.title}
                  </h3>

                  {article.currentRevision?.summary && (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                      {article.currentRevision.summary}
                    </p>
                  )}
                </div>

                <span className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600">
                  →
                </span>
              </div>

              {article.publishedAt && (
                <p className="mt-4 text-xs text-slate-400">
                  {new Date(
                    article.publishedAt
                  ).toLocaleDateString()}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6 sm:hidden">
        <Link
          href="/articles"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View all articles →
        </Link>
      </div>
    </section>
  );
}