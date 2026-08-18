import { redirect } from "next/navigation";
import { requireContributor } from "@/lib/auth";
import { getContributorStats } from "@/lib/services/dashboard/contributor.service";

export default async function ContributorDashboard() {
  const auth = await requireContributor();
  const stats = await getContributorStats(auth.user._id.toString());

  if (auth.status !== 200 || !auth.user) {
    redirect("/login");
  }

  const user = auth.user;

  return (
    <div className="mx-auto max-w-7xl">
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

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            My Articles
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {stats.total}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Articles created by you
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Drafts
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {stats.drafts}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Articles still being edited
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Under Review
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {stats.review}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Waiting for editorial review
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
            Your published articles
          </p>
        </div>
      </div>
    </div>
  );
}