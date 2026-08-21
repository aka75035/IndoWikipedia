import Link from "next/link";
import { redirect } from "next/navigation";

import { requireEditor } from "@/lib/auth";

import {
  getEditorStats,
} from "@/lib/services/dashboard/editor.service";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editor Dashboard",
  description:
    "Manage editorial work, published content, featured articles, and contributors on IndoWikipedia.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function EditorDashboard() {
  const auth = await requireEditor();

  if (auth.status !== 200 || !auth.user) {
    redirect("/login");
  }

  const stats = await getEditorStats();

  const user = auth.user;

  return (
    <main className="mx-auto max-w-7xl">
      {/* Header */}
      <header className="mb-8">
        <p className="text-sm font-medium text-blue-600">
          Editor Dashboard
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Welcome,{" "}
          {user.displayName || user.username}
        </h1>

        <p className="mt-2 text-slate-500">
          Manage editorial work, published
          content, and contributors.
        </p>
      </header>

      {/* Stats */}
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Review Queue"
          value={stats.review}
          description="Articles waiting for review"
          href="/dashboard/editor/review"
          highlight
        />

        <StatCard
          label="Published"
          value={stats.published}
          description="Published articles"
          href="/dashboard/editor/articles"
        />

        <StatCard
          label="Featured"
          value={stats.featured}
          description="Featured articles"
          href="/dashboard/editor/featured"
        />

        <StatCard
          label="Contributors"
          value={stats.contributors}
          description="Active contributors"
          href="/dashboard/editor/contributors"
        />
      </section>

      {/* Editorial work */}
      <section className="mt-10">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-slate-900">
            Editorial Work
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Choose an area to manage.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <DashboardCard
            title="Review Queue"
            description={`${stats.review} articles are waiting for editorial review.`}
            href="/dashboard/editor/review"
            action="Open Queue"
          />

          <DashboardCard
            title="Published Articles"
            description="Manage published articles and their content."
            href="/dashboard/editor/articles"
            action="Manage Articles"
          />

          <DashboardCard
            title="Featured Articles"
            description="Choose and manage articles featured on the platform."
            href="/dashboard/editor/featured"
            action="Manage Featured"
          />

          <DashboardCard
            title="Contributors"
            description="View and manage contributor activity."
            href="/dashboard/editor/contributors"
            action="Manage Contributors"
          />
        </div>
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  description,
  href,
  highlight = false,
}: {
  label: string;
  value: number;
  description: string;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group rounded-xl border bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-md ${
        highlight
          ? "border-amber-200"
          : "border-slate-200"
      }`}
    >
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>

      <p className="mt-4 text-xs font-medium text-blue-600 opacity-0 transition group-hover:opacity-100">
        Open →
      </p>
    </Link>
  );
}

function DashboardCard({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-900">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>

        <span className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600">
          →
        </span>
      </div>

      <div className="mt-5 text-sm font-medium text-blue-600">
        {action}
      </div>
    </Link>
  );
}