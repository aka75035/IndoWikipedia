import { getFeaturedArticles } from "@/lib/articles";
import Link from "next/link";

export default async function FeaturedArticles() {
  const articles = await getFeaturedArticles();

  return (
    <section className="py-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Curated knowledge
          </p>

          <h2 className="mt-1 font-serif text-3xl font-semibold text-slate-900">
            Featured articles
          </h2>
        </div>

        <Link
          href="/articles"
          className="hidden text-sm font-medium text-blue-600 hover:underline sm:block"
        >
          View all →
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/article/${article.slug}`}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="aspect-[16/9] overflow-hidden bg-slate-100">
              <img
                src={article.image}
                alt={article.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            <div className="p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                {article.category}
              </span>

              <h3 className="mt-2 font-serif text-2xl font-semibold text-slate-900 group-hover:text-blue-600">
                {article.title}
              </h3>

              <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                {article.summary}
              </p>

              <span className="mt-4 inline-block text-sm font-medium text-blue-600">
                Read article →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}