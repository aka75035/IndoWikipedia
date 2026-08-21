import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import ProfilePage from "@/components/Profile/ProfilePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description:
    "Manage your IndoWikipedia profile and account information.",
};

export default async function ProfileRoute() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            Account
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Profile
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your profile and account information.
          </p>
        </div>

        <ProfilePage
          user={{
            _id: user._id.toString(),
            username: user.username,
            email: user.email,
            displayName: user.displayName,
            avatar: user.avatar ?? null,
            bio: user.bio ?? "",
            role: user.role,
            status: user.status,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt.toISOString(),
          }}
        />
      </div>
    </main>
  );
}