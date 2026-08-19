"use client";

import {
  Mail,
  Shield,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  LockKeyhole,
  UserRound,
} from "lucide-react";

import { useState } from "react";

import ProfileForm from "./ProfileForm";
import ChangePasswordForm from "./ChangePasswordForm";
import type { ProfileUser } from "@/types/profile";

type Props = {
  user: ProfileUser;
};

/**
 * Format dates consistently on both
 * server and client.
 *
 * Example:
 * 16 Aug 2026
 */
function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function ProfilePage({
  user: initialUser,
}: Props) {
  const [user, setUser] =
    useState(initialUser);

  const initial =
    (user.displayName || user.username)
      .charAt(0)
      .toUpperCase();

  return (
    <div className="space-y-6">
      {/* =====================================================
          PROFILE HERO
      ===================================================== */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Cover */}
        <div className="relative h-36 bg-slate-900 sm:h-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.35),transparent_40%)]" />

          <div className="absolute bottom-4 left-6">
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              Account Profile
            </span>
          </div>
        </div>

        {/* Profile identity */}
        <div className="px-5 pb-6 sm:px-7">
          <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end">
            {/* Avatar */}
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-blue-600 text-3xl font-bold text-white shadow-lg sm:h-28 sm:w-28">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initial
                )}
              </div>

              {/* Account status */}
              <span
                className={`absolute bottom-1.5 right-1.5 h-4 w-4 rounded-full border-2 border-white ${
                  user.status === "active"
                    ? "bg-green-500"
                    : "bg-slate-400"
                }`}
              />
            </div>

            {/* Identity */}
            <div className="min-w-0 flex-1 pb-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  {user.displayName}
                </h2>

                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold capitalize text-blue-700">
                  {user.role}
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                @{user.username}
              </p>

              {user.bio && (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                  {user.bio}
                </p>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-100 pt-5">
            <ProfileMeta
              icon={<Mail size={15} />}
              label={user.email}
            />

            <ProfileMeta
              icon={<CalendarDays size={15} />}
              label={`Member since ${formatDate(
                user.createdAt
              )}`}
            />

            <ProfileMeta
              icon={
                user.emailVerified ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <AlertCircle size={15} />
                )
              }
              label={
                user.emailVerified
                  ? "Email verified"
                  : "Email not verified"
              }
              className={
                user.emailVerified
                  ? "text-green-600"
                  : "text-amber-600"
              }
            />

            <ProfileMeta
              icon={<Shield size={15} />}
              label={user.status}
              className="capitalize"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT GRID
      ===================================================== */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* Personal Information */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader
            icon={<UserRound size={19} />}
            title="Personal Information"
            description="Update the information displayed on your profile."
          />

          <div className="p-5 sm:p-6">
            <ProfileForm
              user={user}
              onUserUpdate={setUser}
            />
          </div>
        </section>

        {/* Account Information */}
        <section className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader
            icon={<Shield size={19} />}
            title="Account Information"
            description="Your account details and permissions."
          />

          <div className="divide-y divide-slate-100">
            <AccountRow
              label="Username"
              value={`@${user.username}`}
            />

            <AccountRow
              label="Email"
              value={user.email}
            />

            <AccountRow
              label="Role"
              value={user.role}
              capitalize
            />

            <AccountRow
              label="Account status"
              value={user.status}
              capitalize
            />

            <AccountRow
              label="Email verification"
              value={
                user.emailVerified
                  ? "Verified"
                  : "Not verified"
              }
              valueClassName={
                user.emailVerified
                  ? "text-green-600"
                  : "text-amber-600"
              }
            />
          </div>
        </section>
      </div>

      {/* =====================================================
          SECURITY
      ===================================================== */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardHeader
          icon={<LockKeyhole size={19} />}
          title="Security"
          description="Protect your account by keeping your password secure."
        />

        <div className="p-5 sm:p-6">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <ChangePasswordForm />
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   CARD HEADER
========================================================= */

function CardHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
        {icon}
      </div>

      <div>
        <h2 className="text-base font-semibold text-slate-900">
          {title}
        </h2>

        <p className="mt-1 text-sm leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   PROFILE META
========================================================= */

function ProfileMeta({
  icon,
  label,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={`flex items-center gap-2 text-sm text-slate-500 ${className}`}
    >
      {icon}

      <span>{label}</span>
    </span>
  );
}

/* =========================================================
   ACCOUNT ROW
========================================================= */

function AccountRow({
  label,
  value,
  capitalize = false,
  valueClassName = "",
}: {
  label: string;
  value: string;
  capitalize?: boolean;
  valueClassName?: string;
}) {
  return (
    <div className="px-5 py-4 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1.5 break-words text-sm font-medium text-slate-800 ${
          capitalize ? "capitalize" : ""
        } ${valueClassName}`}
      >
        {value}
      </p>
    </div>
  );
}