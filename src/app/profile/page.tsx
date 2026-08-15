import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/Profile/ProfileForm";
import ChangePasswordForm from "@/components/Profile/ChangePasswordForm";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-3xl space-y-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            My Profile
          </h1>

          <p className="text-gray-600">
            Manage your account information.
          </p>
        </div>

        <ProfileForm />

        <hr />

        <ChangePasswordForm />
      </div>
    </main>
  );
}