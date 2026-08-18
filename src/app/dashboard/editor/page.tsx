import { redirect } from "next/navigation";
import { requireEditor } from "@/lib/auth";
import { getEditorStats } from "@/lib/services/dashboard/editor.service";

export default async function EditorDashboard() {
  const auth = await requireEditor();
  const stats = await getEditorStats();

  if (auth.status !== 200 || !auth.user) {
    redirect("/login");
  }

  const user = auth.user;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-600">
          Editor Dashboard
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Welcome, {user.displayName || user.username}
        </h1>

        <p className="mt-2 text-slate-500">
          Review articles, manage published content, and curate
          featured articles.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Contributors
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {stats.contributors}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Active contributors
          </p>
        </div>
      </div>
    </div>
  );
}