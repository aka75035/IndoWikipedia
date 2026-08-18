import Link from "next/link";
import { getPopularCategories } from "@/lib/services/category.service";

export default async function CategorySection() {
  const categories = await getPopularCategories(8);

  return (
    <section className="py-8">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Explore knowledge
          </p>

          <h2 className="mt-1 font-serif text-3xl font-semibold text-slate-900">
            Popular Categories
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Explore the topics people are reading and learning
            about.
          </p>
        </div>

        <Link
          href="/categories"
          className="hidden text-sm font-medium text-blue-600 hover:underline sm:block"
        >
          View all →
        </Link>
      </div>

      {/* Categories */}
      {categories.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-sm text-slate-500">
            No popular categories available yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category._id.toString()}
              href={`/category/${category.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-serif text-xl font-semibold text-slate-900 group-hover:text-blue-600">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    {category.articleCount}{" "}
                    {category.articleCount === 1
                      ? "article"
                      : "articles"}
                  </p>
                </div>

                <span className="text-lg text-slate-300 transition duration-200 group-hover:translate-x-1 group-hover:text-blue-600">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Mobile View All */}
      <div className="mt-6 sm:hidden">
        <Link
          href="/categories"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View all categories →
        </Link>
      </div>
    </section>
  );
}