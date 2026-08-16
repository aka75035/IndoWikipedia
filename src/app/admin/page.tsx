import {
  getArticles,
  getCategoryCount,
  getRecentArticles,
} from "@/lib/articles";
import {
  getRecentUsers,
  getUserCount,
} from "@/lib/user";

import StatCard from "@/components/Admin/StatCard";
import RecentArticles from "@/components/Admin/RecentArticles";
import RecentUsers from "@/components/Admin/RecentUsers";

export default async function AdminDashboard() {
  const [
    articleData,
    userCount,
    categoryCount,
    recentArticles,
    recentUsers,
  ] = await Promise.all([
    getArticles(),
    getUserCount(),
    getCategoryCount(),
    getRecentArticles(),
    getRecentUsers(),
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-gray-500">
          Welcome Admin
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Articles"
          value={articleData.total}
        />

        <StatCard
          title="Total Users"
          value={userCount}
        />

        <StatCard
          title="Total Categories"
          value={categoryCount}
        />
      </div>

      {/* Recent Articles */}
      <div className="mt-6">
        <RecentArticles articles={recentArticles} />
      </div>

      {/* Recent Users */}
      <div className="mt-6">
        <RecentUsers users={recentUsers} />
      </div>
    </div>
  );
}