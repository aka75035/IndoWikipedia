import Link from "next/link";
import { ReactNode } from "react";
import {
  LayoutDashboard,
  Newspaper,
  FolderTree,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

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
    href: "/admin",
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

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col">

        <div className="h-20 flex items-center justify-center border-b border-slate-700">
          <h1 className="text-2xl font-bold">
            Admin Panel
          </h1>
        </div>

        <nav className="flex-1 p-5 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-slate-800 transition"
              >
                <Icon size={20} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-5 border-t border-slate-700">
          <button className="w-full flex items-center gap-3 rounded-lg px-4 py-3 bg-red-500 hover:bg-red-600 transition">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto text-black font-black">
        {children}
      </main>
    </div>
  );
}