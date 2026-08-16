import Link from "next/link";
import { ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  FolderTree,
  Users,
  Settings,
} from "lucide-react";
import LogoutButton from "./logout";

interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Articles",
    href: "/admin/articles",
    icon: Newspaper,
  },
  {
    title: "Categories",
    href: "/admin",
    icon: FolderTree,
  },
  {
    title: "Users",
    href: "/admin",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/admin",
    icon: Settings,
  },
];

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <aside className="flex h-[calc(100vh-48px)] w-72 shrink-0 flex-col bg-slate-900 text-white">
        
        {/* Header */}
        <div className="flex h-20 shrink-0 items-center justify-center border-b border-slate-700">
          <h1 className="text-2xl font-bold">
            Admin Panel
          </h1>
        </div>

        {/* User */}
        <div className="shrink-0 border-b border-slate-700 p-5">
          <p className="font-semibold">{user.name}</p>

          <p className="text-sm text-slate-400">
            {user.email}
          </p>

          <p className="mt-1 text-xs uppercase text-slate-500">
            {user.role}
          </p>
        </div>

        {/* Navigation */}
        <nav className="min-h-0 flex-1 overflow-y-auto p-5 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-4 py-3 transition hover:bg-slate-800"
              >
                <Icon size={20} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="shrink-0 border-t border-slate-700 p-5">
          <LogoutButton />
        </div>
      </aside>

      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto p-8 text-black">
        {children}
      </main>
    </div>
  );
}