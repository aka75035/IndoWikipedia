import { getArticles } from "@/lib/articles";
import Link from "next/link";

export default async function AdminDashboard(){
  const articles = await getArticles();
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">

    {/* Header */}

    <div className="flex items-center justify-between mb-8">

        <div>
            <h1 className="text-3xl font-bold">
                Articles
            </h1>

            <p className="text-gray-500">
                Manage all blog articles
            </p>
        </div>

        <Link href={"/admin/new"} className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700">
            + New Article
        </Link>

    </div>


    {/* Search */}

    <div className="mb-6">
        <input
            type="text"
            placeholder="Search article..."
            className="w-full md:w-96 border rounded-lg px-4 py-3"
        />
    </div>


    {/* Table */}

    <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full">

            <thead className="bg-gray-50 border-b">

                <tr>

                    <th className="px-5 py-4 text-left">#</th>

                    <th className="px-5 py-4 text-left">
                        Image
                    </th>

                    <th className="px-5 py-4 text-left">
                        Title
                    </th>

                    <th className="px-5 py-4 text-left">
                        Category
                    </th>

                    <th className="px-5 py-4 text-left">
                        Slug
                    </th>

                    <th className="px-5 py-4 text-left">
                        Summary
                    </th>

                    <th className="px-5 py-4 text-left">
                        Created
                    </th>

                    <th className="px-5 py-4 text-center">
                        Actions
                    </th>

                </tr>

            </thead>

            <tbody>

                {articles?.map((article, index) => (

                    <tr
                        key={article.slug}
                        className="border-b hover:bg-gray-50 transition"
                    >

                        <td className="px-5 py-4">
                            {index + 1}
                        </td>

                        <td className="px-5 py-4">

                            <img
                                src={article.image}
                                alt={article.title}
                                className="h-16 w-16 rounded-lg object-cover"
                            />

                        </td>

                        <td className="px-5 py-4 font-medium">
                            {article.title}
                        </td>

                        <td className="px-5 py-4">

                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">

                                {article.category}

                            </span>

                        </td>

                        <td className="px-5 py-4 text-gray-500">
                            {article.slug}
                        </td>

                        <td className="px-5 py-4 max-w-xs truncate">
                            {article.summary}
                        </td>

                        <td className="px-5 py-4 text-gray-500">
                            {new Date(article.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-5 py-4">

                            <div className="flex justify-center gap-2">

                                <Link href={`/admin/edit/${article.slug}`}
                                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded"
                                >
                                    Edit
                                </Link>

                                <Link href={"/admin"}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                >
                                    Delete
                                </Link>

                            </div>

                        </td>

                    </tr>

                ))}

            </tbody>

        </table>

    </div>

</div>
  );
}