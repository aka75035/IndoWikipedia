import Link from "next/link";
import { redirect } from "next/navigation";

import { requireContributor } from "@/lib/auth";

import {
  getContributorArticles,
  getContributorStats,
} from "@/lib/services/dashboard/contributor.service";
import SubmitForReviewButton from "@/components/Dashboard/Contributor/SubmitForReviewButton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contributor Dashboard",
  description:
    "Create, manage, and track your IndoWikipedia articles.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ContributorDashboard() {
  const auth = await requireContributor();

  if (auth.status !== 200 || !auth.user) {
    redirect("/login");
  }

  const user = auth.user;

  const userId = user._id.toString();

  const [stats, articles] = await Promise.all([
    getContributorStats(userId),
    getContributorArticles(userId),
  ]);

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-600">
          Contributor Dashboard
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Welcome, {user.displayName || user.username}
        </h1>

        <p className="mt-2 text-slate-500">
          Create, manage, and track your articles.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="My Articles"
          value={stats.total}
          description="Articles created by you"
        />

        <StatCard
          label="Drafts"
          value={stats.drafts}
          description="Articles still being edited"
        />

        <StatCard
          label="Under Review"
          value={stats.review}
          description="Waiting for editorial review"
        />

        <StatCard
          label="Published"
          value={stats.published}
          description="Your published articles"
        />
      </div>

      {/* Articles */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              My Articles
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage your articles and track their review status.
            </p>
          </div>

          <Link
            href="/dashboard/contributor/articles/create"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Create Article
          </Link>
        </div>

        {/* Empty state */}
        {articles.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-500">
              You haven&apos;t created any articles yet.
            </p>

            <Link
              href="/dashboard/contributor/articles/create"
              className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              Create your first article
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {articles.map((article) => (
              <ArticleRow
                key={article._id.toString()}
                article={article}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* -----------------------------
   STAT CARD
----------------------------- */

type StatCardProps = {
  label: string;
  value: number;
  description: string;
};

function StatCard({
  label,
  value,
  description,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}

/* -----------------------------
   ARTICLE ROW
----------------------------- */

type ArticleRowProps = {
  article: {
    _id: unknown;
    title: string;
    slug: string;
    status: string;
    updatedAt: Date;
    currentRevision?: {
      version?: number;
      title?: string;
      summary?: string;
    } | null;
  };
};

function ArticleRow({
  article,
}: ArticleRowProps) {
  const statusClass =
    article.status === "draft"
      ? "bg-slate-100 text-slate-700"
      : article.status === "review"
        ? "bg-amber-100 text-amber-700"
        : article.status === "published"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700";

  return (
    <div className="p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Article information */}
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-slate-900">
            {article.title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            /{article.slug}
          </p>

          <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
            <span>
              Revision{" "}
              {article.currentRevision?.version ?? 0}
            </span>

            <span>
              Updated{" "}
              {new Date(
                article.updatedAt
              ).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status */}
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusClass}`}
          >
            {article.status}
          </span>

          {/* Edit */}
          <Link
            href={`/dashboard/contributor/articles/${article.slug}/edit`}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Edit
          </Link>

          {/* Submit */}
          {article.status === "draft" && (
            <SubmitForReviewButton
              slug={article.slug}
            />
          )}

          {/* Review state */}
          {article.status === "review" && (
            <span className="text-sm text-amber-600">
              Waiting for editor
            </span>
          )}
        </div>
      </div>
    </div>
  );
}