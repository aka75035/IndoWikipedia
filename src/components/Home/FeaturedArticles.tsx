import Link from "next/link";
import { getFeaturedArticles } from "@/lib/services/article.service";

export default async function FeaturedArticles() {
  const articles = await getFeaturedArticles(6);

  return (
    <section className="py-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Curated knowledge
          </p>

          <h2 className="mt-1 font-serif text-3xl font-semibold text-slate-900">
            Featured Articles
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Explore articles selected for their importance and
            value.
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
            No featured articles yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article._id.toString()}
              href={`/articles/${article.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                  Featured
                </span>

                <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600">
                  →
                </span>
              </div>

              <h3 className="mt-5 font-serif text-2xl font-semibold text-slate-900 group-hover:text-blue-600">
                {article.currentRevision?.title ??
                  article.title}
              </h3>

              {article.currentRevision?.summary && (
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                  {article.currentRevision.summary}
                </p>
              )}

              <span className="mt-5 inline-block text-sm font-medium text-blue-600">
                Read article →
              </span>
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