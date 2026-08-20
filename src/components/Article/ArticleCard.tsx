import Link from "next/link";

type ArticleCardProps = {
  article: {
    title: string;
    slug: string;
    summary?: string;
    publishedAt?: string | Date | null;
    isFeatured?: boolean;
  };
};

export default function ArticleCard({
  article,
}: ArticleCardProps) {
  return (
    <article className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <Link
        href={`/articles/${article.slug}`}
        className="block p-5"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold leading-7 text-slate-900 transition group-hover:text-blue-600">
            {article.title}
          </h2>

          {article.isFeatured && (
            <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
              Featured
            </span>
          )}
        </div>

        {article.summary && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
            {article.summary}
          </p>
        )}

        {article.publishedAt && (
          <p className="mt-4 text-xs text-slate-400">
            Published{" "}
            {new Date(
              article.publishedAt
            ).toLocaleDateString()}
          </p>
        )}
      </Link>
    </article>
  );
}