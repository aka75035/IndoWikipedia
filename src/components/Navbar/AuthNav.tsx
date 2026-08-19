import Link from "next/link";
import UserMenu from "./UserMenu";

import { AuthUser } from "@/types/user";

type Props = {
  user: AuthUser | null;
};

export default function AuthNav({
  user,
}: Props) {
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
        >
          Login
        </Link>

        <Link
          href="/register"
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return <UserMenu user={user} />;
}