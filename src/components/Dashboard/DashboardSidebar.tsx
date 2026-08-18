import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Plus,
  ClipboardCheck,
  Star,
  Users,
  FolderTree,
  Shield,
  Settings,
  Bookmark,
  History,
} from "lucide-react";

type UserRole =
  | "user"
  | "contributor"
  | "editor"
  | "moderator"
  | "admin";

type DashboardSidebarProps = {
  role: UserRole;
};

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const commonItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
];

const roleItems: Record<UserRole, NavItem[]> = {
  user: [
    {
      label: "Saved Articles",
      href: "/dashboard/saved",
      icon: Bookmark,
    },
    {
      label: "Reading History",
      href: "/dashboard/history",
      icon: History,
    },
  ],

  contributor: [
    {
      label: "My Articles",
      href: "/dashboard/contributor/articles",
      icon: FileText,
    },
    {
      label: "Create Article",
      href: "/dashboard/contributor/articles/create",
      icon: Plus,
    },
    {
      label: "Drafts",
      href: "/dashboard/contributor/articles/drafts",
      icon: FileText,
    },
    {
      label: "Review Status",
      href: "/dashboard/contributor/articles/review",
      icon: ClipboardCheck,
    },
  ],

  editor: [
    {
      label: "Articles",
      href: "/dashboard/articles",
      icon: FileText,
    },
    {
      label: "Review Queue",
      href: "/dashboard/review",
      icon: ClipboardCheck,
    },
    {
      label: "Featured Articles",
      href: "/dashboard/featured",
      icon: Star,
    },
    {
      label: "Categories",
      href: "/dashboard/categories",
      icon: FolderTree,
    },
    {
      label: "Contributors",
      href: "/dashboard/contributors",
      icon: Users,
    },
  ],

  moderator: [
    {
      label: "Reports",
      href: "/dashboard/reports",
      icon: Shield,
    },
    {
      label: "Flagged Content",
      href: "/dashboard/moderation",
      icon: Shield,
    },
    {
      label: "Moderation History",
      href: "/dashboard/moderation/history",
      icon: History,
    },
  ],

  admin: [
    {
      label: "Users",
      href: "/dashboard/users",
      icon: Users,
    },
    {
      label: "Articles",
      href: "/dashboard/articles",
      icon: FileText,
    },
    {
      label: "Review Queue",
      href: "/dashboard/review",
      icon: ClipboardCheck,
    },
    {
      label: "Featured Articles",
      href: "/dashboard/featured",
      icon: Star,
    },
    {
      label: "Categories",
      href: "/dashboard/categories",
      icon: FolderTree,
    },
    {
      label: "Moderation",
      href: "/dashboard/moderation",
      icon: Shield,
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ],
};

export default function DashboardSidebar({
  role,
}: DashboardSidebarProps) {
  const items = [
    ...commonItems,
    ...roleItems[role],
  ];

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <Link
          href="/"
          className="text-lg font-bold text-slate-900"
        >
          🇮🇳 IndoWikipedia
        </Link>
      </div>

      <nav className="space-y-1 p-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
            >
              <Icon size={19} />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}