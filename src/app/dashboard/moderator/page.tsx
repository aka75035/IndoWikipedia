import { redirect } from "next/navigation";

import { requireModerator } from "@/lib/auth";

import {
  getModeratorStats,
} from "@/lib/services/dashboard/moderator.service";

export default async function ModeratorDashboard() {
  const auth = await requireModerator();

  if (auth.status !== 200 || !auth.user) {
    redirect("/login");
  }

  const user = auth.user;

  const stats =
    await getModeratorStats();

  return (
    <div className="mx-auto max-w-7xl">

      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-600">
          Moderator Dashboard
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Welcome,{" "}
          {user.displayName || user.username}
        </h1>

        <p className="mt-2 text-slate-500">
          Manage reports, flagged content,
          and community moderation.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {/* Open Reports */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Open Reports
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {stats.active}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Reports waiting for action
          </p>
        </div>

        {/* Pending */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Pending
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {stats.pending}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Reports waiting to be reviewed
          </p>
        </div>

        {/* Investigating */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Investigating
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {stats.investigating}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Reports currently being investigated
          </p>
        </div>

        {/* Resolved */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Resolved
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {stats.resolved}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Resolved moderation cases
          </p>
        </div>

      </div>

      {/* Additional information */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        {/* Report summary */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Report Summary
          </h2>

          <div className="mt-5 space-y-4">

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Pending
              </span>

              <span className="font-semibold text-slate-900">
                {stats.pending}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Investigating
              </span>

              <span className="font-semibold text-slate-900">
                {stats.investigating}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Resolved
              </span>

              <span className="font-semibold text-slate-900">
                {stats.resolved}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Rejected
              </span>

              <span className="font-semibold text-slate-900">
                {stats.rejected}
              </span>
            </div>

          </div>
        </div>

        {/* Account */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Moderator Account
          </h2>

          <div className="mt-5 space-y-4">

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
    </div>
  );
}