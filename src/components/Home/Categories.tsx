import { getCategories } from "@/lib/articles";
import Link from "next/link";

function categorySlug(category: string) {
  return category
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default async function CategorySection() {
  const categories = await getCategories();
  console.log(categories);

  return (
    <section>
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-slate-900">
          Explore Categories
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Explore knowledge by topic
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories
          .filter(
            (category): category is string =>
              typeof category === "string" &&
              category.trim().length > 0
          )
          .map((category) => (
            <Link
              key={category}
              href={`/category/${categorySlug(category)}`}
              className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:bg-blue-50"
            >
              <h3 className="font-serif text-xl font-semibold text-slate-900 group-hover:text-blue-600">
                {category}
              </h3>
            </Link>
          ))}
      </div>
    </section>
  );
}