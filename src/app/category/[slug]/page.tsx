import Link from "next/link";
import { notFound } from "next/navigation";

import { getCategory, getArticlesByCategory, } from "@/lib/services/category.service";
import { Metadata } from "next";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const category = await getCategory(slug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: category.name,
    description:
      category.description ||
      `Explore articles in the ${category.name} category on IndoWikipedia.`,
  };
}

export default async function CategoryPage({
  params,
}: Props) {
  const { slug } = await params;

  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  const articles = await getArticlesByCategory(slug);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-slate-500">
          <Link
            href="/"
            className="hover:text-blue-600 hover:underline"
          >
            Home
          </Link>

          <span className="mx-2">›</span>

          <span className="text-slate-700">
            {category.name}
          </span>
        </nav>

        {/* Category header */}
        <header className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Category
          </p>

          <h1 className="mt-2 font-serif text-4xl font-bold text-slate-900">
            {category.name}
          </h1>

          {category.description && (
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              {category.description}
            </p>
          )}
        </header>

        {/* Articles */}
        <section>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-slate-900">
                Articles
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {articles.length}{" "}
                {articles.length === 1
                  ? "article"
                  : "articles"}{" "}
                in this category
              </p>
            </div>
          </div>

          {articles.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
              <h3 className="text-lg font-semibold text-slate-900">
                No articles yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                There are no published articles in this
                category yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link
                  key={article._id.toString()}
                  href={`/articles/${article.slug}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                >
                  <h3 className="font-serif text-xl font-semibold text-slate-900 group-hover:text-blue-600">
                    {article.currentRevision?.title ??
                      article.title}
                  </h3>

                  {article.currentRevision
                    ?.summary && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                      {
                        article.currentRevision
                          .summary
                      }
                    </p>
                  )}

                  <span className="mt-5 inline-block text-sm font-medium text-blue-600">
                    Read article →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}