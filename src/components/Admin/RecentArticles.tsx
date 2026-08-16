import Link from "next/link";

interface Article {
  title: string;
  category: string;
  slug: string;
  createdAt: Date | string;
}

interface RecentArticlesProps {
  articles: Article[];
}

export default function RecentArticles({
  articles,
}: RecentArticlesProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Recent Articles
        </h2>

        <Link
          href="/admin/articles"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View All
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          No articles found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-sm text-gray-500">
                <th className="px-4 py-3 font-medium">
                  Title
                </th>

                <th className="px-4 py-3 font-medium">
                  Category
                </th>

                <th className="px-4 py-3 font-medium">
                  Date
                </th>

                <th className="px-4 py-3 text-right font-medium">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {articles.map((article) => (
                <tr
                  key={article.slug}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="max-w-xs truncate px-4 py-4 font-medium">
                    {article.title}
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {article.category}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-500">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/admin/articles/edit/${article.slug}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

