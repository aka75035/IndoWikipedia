import { redirect } from "next/navigation";

import {requireLoggedInUser} from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Dashboard",
  description:
    "Manage your IndoWikipedia account and activity.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function UserDashboard() {
  const auth = await requireLoggedInUser();

  if (auth.status !== 200 || !auth.user) {
    redirect("/login");
  }

  const user = auth.user;

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-600">
          Your Dashboard
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Welcome, {user.displayName || user.username}
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your IndoWikipedia account and activity.
        </p>
      </div>

      {/* Overview cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Account
          </p>

          <h2 className="mt-2 text-xl font-semibold text-slate-900">
            {user.displayName || user.username}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            @{user.username}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Role
          </p>

          <h2 className="mt-2 text-xl font-semibold capitalize text-slate-900">
            {user.role}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your current platform role
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Account Status
          </p>

          <h2 className="mt-2 text-xl font-semibold capitalize text-slate-900">
            {user.status}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Current account status
          </p>
        </div>
      </div>
    </div>
  );
}