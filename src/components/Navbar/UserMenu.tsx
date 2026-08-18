"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  User,
  FileText,
  Shield,
} from "lucide-react";
import LogoutButton from "../Auth/LogoutButton";

type UserMenuProps = {
  user: {
    _id: string;
    username: string;
    displayName?: string;
    role: string;
  };
};

export default function UserMenu({
  user,
}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isAdmin = user.role === "admin";
  const isEditor =
    user.role === "editor" ||
    user.role === "admin";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-slate-100"
        aria-expanded={isOpen}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
          {(user.displayName ||
            user.username)
            .charAt(0)
            .toUpperCase()}
        </div>

        <span className="hidden max-w-32 truncate text-sm font-medium text-slate-700 sm:block">
          {user.displayName ||
            user.username}
        </span>

        <ChevronDown
          size={16}
          className={`transition-transform ${
            isOpen
              ? "rotate-180"
              : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          {/* User information */}
          <div className="border-b border-slate-200 px-4 py-3">
            <p className="truncate text-sm font-semibold text-slate-900">
              {user.displayName ||
                user.username}
            </p>

            <p className="mt-0.5 text-xs capitalize text-slate-500">
              {user.role}
            </p>
          </div>

          {/* Profile */}
          <div className="p-2">
            <Link
              href="/profile"
              onClick={() =>
                setIsOpen(false)
              }
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              <User size={16} />
              Profile
            </Link>

            {/* Contributor and above */}
            {(user.role ===
              "contributor" ||
              isEditor) && (
              <>
                <Link
                  href="/articles/create"
                  onClick={() =>
                    setIsOpen(false)
                  }
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                >
                  <FileText size={16} />
                  Create Article
                </Link>

                <Link
                  href="/my-articles"
                  onClick={() =>
                    setIsOpen(false)
                  }
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                >
                  <FileText size={16} />
                  My Articles
                </Link>
              </>
            )}

            {/* Editor and above */}
            {isEditor && (
              <Link
                href="/editor/review"
                onClick={() =>
                  setIsOpen(false)
                }
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                <Shield size={16} />
                Review Queue
              </Link>
            )}

            {/* Admin */}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() =>
                  setIsOpen(false)
                }
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                <Shield size={16} />
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Logout */}
          <div className="border-t border-slate-200 p-2">
            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  );
}