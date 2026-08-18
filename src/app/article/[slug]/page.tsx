import { getArticle } from "@/lib/articles";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

function categorySlug(category: string) {
  return category
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const article = await getArticle(slug);

  if (!article) {
    return {
      title: "Article Not Found | IndoWikipedia",
    };
  }

  return {
    title: `${article.title} | IndoWikipedia`,
    description: article.summary,
  };
}

export default async function ArticlePage({
  params,
}: Props) {
  const { slug } = await params;

  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">

        {/* Article header */}
        <header className="border-b border-slate-200 pb-8">
          {/* Category */}
          <Link
            href={`/category/${categorySlug(article.category)}`}
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            {article.category}
          </Link>

          {/* Title */}
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            {article.title}
          </h1>

          {/* Summary */}
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-600">
            {article.summary}
          </p>

          {/* Metadata */}
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
            <span>
              Last updated{" "}
              {new Date(article.updatedAt).toLocaleDateString()}
            </span>

            <span className="hidden sm:inline">•</span>

            <span>
              Category{" "}
              <Link
                href={`/category/${categorySlug(article.category)}`}
                className="text-blue-600 hover:underline"
              >
                {article.category}
              </Link>
            </span>
          </div>
        </header>

        {/* Main content */}
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">

          {/* Article */}
          <article className="min-w-0">

            {/* Image */}
            {article.image && (
              <figure className="mb-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <Image
                  src={article.image}
                  alt={article.title}
                  width={1200}
                  height={550}
                  className="max-h-[550px] w-full object-cover"
                />

                <figcaption className="border-t border-slate-200 px-4 py-3 text-sm text-slate-500">
                  {article.title}
                </figcaption>
              </figure>
            )}

            {/* Content */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
              <div className="whitespace-pre-wrap font-sans text-[17px] leading-8 text-slate-800">
                {article.content}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-serif text-xl font-semibold text-slate-900">
                About this article
              </h2>

              <dl className="mt-5 space-y-4 text-sm">

                <div>
                  <dt className="text-slate-500">
                    Category
                  </dt>

                  <dd className="mt-1">
                    <Link
                      href={`/category/${categorySlug(
                        article.category
                      )}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {article.category}
                    </Link>
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500">
                    Last updated
                  </dt>

                  <dd className="mt-1 font-medium text-slate-800">
                    {new Date(
                      article.updatedAt
                    ).toLocaleDateString()}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500">
                    Article status
                  </dt>

                  <dd className="mt-1">
                    <span className="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                      Published
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>

        {/* Footer information */}
        <footer className="mt-10 border-t border-slate-200 pt-6">
          <p className="text-sm text-slate-500">
            This article is part of the{" "}
            <Link
              href={`/category/${categorySlug(
                article.category
              )}`}
              className="text-blue-600 hover:underline"
            >
              {article.category}
            </Link>{" "}
            collection on IndoWikipedia.
          </p>
        </footer>
      </div>
    </main>
  );
}