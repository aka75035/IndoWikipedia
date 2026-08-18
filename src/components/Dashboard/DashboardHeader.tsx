import Link from "next/link";
import { UserCircle } from "lucide-react";

import LogoutButton from "@/components/Auth/LogoutButton";
import Image from "next/image";

type UserRole =
  | "user"
  | "contributor"
  | "editor"
  | "moderator"
  | "admin";

type DashboardHeaderProps = {
  user: {
    username: string;
    displayName: string;
    role: UserRole;
    avatar?: string | null;
  };
};

export default function DashboardHeader({
  user,
}: DashboardHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <p className="text-sm text-slate-500">
          Welcome back
        </p>

        <h1 className="text-lg font-semibold text-slate-900">
          {user.displayName || user.username}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Profile */}
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-slate-100"
        >
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.displayName}
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <UserCircle
              size={36}
              className="text-slate-400"
            />
          )}

          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium text-slate-900">
              {user.displayName || user.username}
            </p>

            <p className="text-xs capitalize text-slate-500">
              {user.role}
            </p>
          </div>
        </Link>

        {/* Logout */}
        <div className="w-auto">
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}