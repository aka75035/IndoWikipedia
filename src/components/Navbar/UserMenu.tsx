"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  User,
  FileText,
  Shield,
  LayoutDashboard,
  ClipboardCheck,
  Star,
  FolderTree,
  Users,
  Plus,
  LogIn,
} from "lucide-react";

import LogoutButton from "../Auth/LogoutButton";

type UserRole =
  | "user"
  | "contributor"
  | "editor"
  | "moderator"
  | "admin";

type UserMenuProps = {
  user: {
    _id: string;
    username: string;
    displayName?: string;
    role: UserRole;
  };
};

export default function UserMenu({
  user,
}: UserMenuProps) {
  const [isOpen, setIsOpen] =
    useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* =====================================================
          USER BUTTON
      ===================================================== */}
      <button
        type="button"
        onClick={() =>
          setIsOpen((open) => !open)
        }
        className="flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-slate-100"
        aria-expanded={isOpen}
        aria-haspopup="menu"
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

      {/* =====================================================
          DROPDOWN
      ===================================================== */}
      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
        >
          {/* =================================================
              USER INFO
          ================================================= */}
          <div className="border-b border-slate-200 px-4 py-3">
            <p className="truncate text-sm font-semibold text-slate-900">
              {user.displayName ||
                user.username}
            </p>

            <p className="mt-0.5 text-xs capitalize text-slate-500">
              {user.role}
            </p>
          </div>

          {/* =================================================
              COMMON
          ================================================= */}
          <div className="p-2">
            <Link
              href="/profile"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              <User size={16} />
              Profile
            </Link>

            <Link
              href="/dashboard"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
          </div>

          {/* =================================================
              USER
          ================================================= */}
          {user.role === "user" && (
            <div className="border-t border-slate-100 p-2">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                My Library
              </p>

              <Link
                href="/dashboard/saved"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                <FileText size={16} />
                Saved Articles
              </Link>

              <Link
                href="/dashboard/history"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                <FileText size={16} />
                Reading History
              </Link>
            </div>
          )}

          {/* =================================================
              CONTRIBUTOR
          ================================================= */}
          {user.role === "contributor" && (
            <div className="border-t border-slate-100 p-2">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Contributor
              </p>

              <Link
                href="/dashboard/contributor/articles"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                <FileText size={16} />
                My Articles
              </Link>

              <Link
                href="/dashboard/contributor/articles/create"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                <Plus size={16} />
                Create Article
              </Link>

              <Link
                href="/dashboard/contributor/articles/drafts"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                <FileText size={16} />
                Drafts
              </Link>

              <Link
                href="/dashboard/contributor/articles/review"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                <ClipboardCheck size={16} />
                Review Status
              </Link>
            </div>
          )}

          {/* =================================================
              EDITOR
          ================================================= */}
          {user.role === "editor" && (
            <div className="border-t border-slate-100 p-2">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Editorial
              </p>

              <Link
                href="/dashboard/editor/articles"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                <FileText size={16} />
                Articles
              </Link>

              <Link
                href="/dashboard/editor/review"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                <ClipboardCheck size={16} />
                Review Queue
              </Link>

              <Link
                href="/dashboard/editor/featured"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                <Star size={16} />
                Featured Articles
              </Link>

              <Link
                href="/dashboard/editor/categories"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                <FolderTree size={16} />
                Categories
              </Link>

              <Link
                href="/dashboard/editor/contributors"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                <Users size={16} />
                Contributors
              </Link>
            </div>
          )}

          {/* =================================================
              MODERATOR
          ================================================= */}
          {user.role === "moderator" && (
            <div className="border-t border-slate-100 p-2">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Moderation
              </p>

              <Link
                href="/dashboard/moderator/reports"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                <Shield size={16} />
                Reports
              </Link>

              <Link
                href="/dashboard/moderator/moderation"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                <Shield size={16} />
                Flagged Content
              </Link>

              <Link
                href="/dashboard/moderator/moderation/history"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                <FileText size={16} />
                Moderation History
              </Link>
            </div>
          )}

          {/* =================================================
              ADMIN
          ================================================= */}
          {user.role === "admin" && (
            <div className="border-t border-slate-100 p-2">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Administration
              </p>

              <Link
                href="/dashboard/admin/users"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                <Users size={16} />
                Users
              </Link>

              <Link
                href="/dashboard/admin/articles"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                <FileText size={16} />
                Articles
              </Link>

              <Link
                href="/dashboard/admin/review"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                <ClipboardCheck size={16} />
                Review Queue
              </Link>

              <Link
                href="/dashboard/admin/featured"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                <Star size={16} />
                Featured Articles
              </Link>

              <Link
                href="/dashboard/admin/categories"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                <FolderTree size={16} />
                Categories
              </Link>

              <Link
                href="/dashboard/admin/moderation"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                <Shield size={16} />
                Moderation
              </Link>

              <Link
                href="/dashboard/admin/settings"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                <Shield size={16} />
                Settings
              </Link>
            </div>
          )}

          {/* =================================================
              LOGOUT
          ================================================= */}
          <div className="border-t border-slate-200 p-2">
            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  );
}