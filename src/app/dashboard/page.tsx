import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  switch (user.role) {
    case "admin":
      redirect("/dashboard/admin");

    case "moderator":
      redirect("/dashboard/moderator");

    case "editor":
      redirect("/dashboard/editor");

    case "contributor":
      redirect("/dashboard/contributor");

    case "user":
    default:
      redirect("/dashboard/user");
  }
}