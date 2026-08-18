import Link from "next/link";

import { getCategories } from "@/lib/services/category.service";

export default async function CategoriesPage() {
  const categories = await getCategories();

  const validCategories = categories.filter(
    (category) =>
      category &&
      typeof category.name === "string" &&
      category.name.trim().length > 0
  );

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
            Categories
          </span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Explore knowledge
          </p>

          <h1 className="mt-2 font-serif text-4xl font-bold text-slate-900">
            All Categories
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Browse all categories and discover articles
            by topic.
          </p>
        </header>

        {/* Categories */}
        {validCategories.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              No categories found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Categories will appear here when they are
              created.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {validCategories.map((category) => (
              <Link
                key={category._id.toString()}
                href={`/category/${category.slug}`}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-serif text-xl font-semibold text-slate-900 group-hover:text-blue-600">
                    {category.name}
                  </h2>

                  <span className="text-lg text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600">
                    →
                  </span>
                </div>

                {category.description && (
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                    {category.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}