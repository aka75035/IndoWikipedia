import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <DashboardSidebar role={user.role} />

      <main className="lg:pl-64">
        {children}
      </main>
    </div>
  );
}