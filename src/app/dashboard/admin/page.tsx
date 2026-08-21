import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";

import { getAdminStats } from "@/lib/services/dashboard/admin.service";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description:
    "Manage IndoWikipedia users, articles, categories, moderation, and platform content.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDashboard() {
  const auth = await requireAdmin();

  if (auth.status !== 200 || !auth.user) {
    redirect("/login");
  }

  const user = auth.user;

  const stats = await getAdminStats();

  return (
    <div className="mx-auto max-w-7xl">

      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-600">
          Administration
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Welcome,{" "}
          {user.displayName || user.username}
        </h1>

        <p className="mt-2 text-slate-500">
          Manage users, articles, categories,
          moderation, and platform content.
        </p>
      </div>

      {/* Main statistics */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {/* Users */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Users
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {stats.users}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Registered users
          </p>
        </div>

        {/* Articles */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Articles
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {stats.articles}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Total articles
          </p>
        </div>

        {/* Published */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Published
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {stats.published}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Published articles
          </p>
        </div>

        {/* Review */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Review Queue
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {stats.review}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Articles waiting for review
          </p>
        </div>

      </div>

      {/* Secondary statistics */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {/* Drafts */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Drafts
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {stats.drafts}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Unpublished drafts
          </p>
        </div>

        {/* Featured */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Featured
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {stats.featured}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Featured articles
          </p>
        </div>

        {/* Categories */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Categories
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {stats.categories}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Available categories
          </p>
        </div>

        {/* Reports */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Open Reports
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {stats.reports}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Pending or investigating
          </p>
        </div>

      </div>

      {/* Account */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Administrator Account
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-3">

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Username
            </p>

            <p className="mt-1 text-sm font-medium text-slate-900">
              @{user.username}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Role
            </p>

            <p className="mt-1 text-sm font-medium capitalize text-slate-900">
              {user.role}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Status
            </p>

            <p className="mt-1 text-sm font-medium capitalize text-slate-900">
              {user.status}
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}