"use client";

import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  onToggle: () => void;
  autoComplete?: string;
};

function PasswordField({
  id,
  label,
  value,
  onChange,
  showPassword,
  onToggle,
  autoComplete,
}: PasswordFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-slate-800"
      >
        {label}
      </label>

      <div className="relative">
        <LockKeyhole
          size={17}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          required
          autoComplete={autoComplete}
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={
            showPassword
              ? `Hide ${label}`
              : `Show ${label}`
          }
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          {showPassword ? (
            <EyeOff size={17} />
          ) : (
            <Eye size={17} />
          )}
        </button>
      </div>
    </div>
  );
}

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrent, setShowCurrent] =
    useState(false);

  const [showNew, setShowNew] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const router = useRouter();

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      newPassword !==
      confirmPassword
    ) {
      setError(
        "New passwords do not match."
      );
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "New password must be at least 8 characters."
      );
      return;
    }

    if (
      currentPassword === newPassword
    ) {
      setError(
        "New password must be different from your current password."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/password",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data?.message ||
            "Failed to change password."
        );
        return;
      }

      /*
       * Password changed successfully.
       *
       * End the current session because
       * the authentication credentials
       * have changed.
       */
      await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        }
      );

      router.push("/login");
      router.refresh();
    } catch {
      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl space-y-6"
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <LockKeyhole size={19} />
          </div>

          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Change Password
            </h3>

            <p className="mt-0.5 text-sm text-slate-500">
              Choose a strong password for
              your account.
            </p>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        <PasswordField
          id="currentPassword"
          label="Current Password"
          value={currentPassword}
          onChange={
            setCurrentPassword
          }
          showPassword={showCurrent}
          onToggle={() =>
            setShowCurrent(
              (value) => !value
            )
          }
          autoComplete="current-password"
        />

        <PasswordField
          id="newPassword"
          label="New Password"
          value={newPassword}
          onChange={setNewPassword}
          showPassword={showNew}
          onToggle={() =>
            setShowNew(
              (value) => !value
            )
          }
          autoComplete="new-password"
        />

        <PasswordField
          id="confirmPassword"
          label="Confirm New Password"
          value={confirmPassword}
          onChange={
            setConfirmPassword
          }
          showPassword={showConfirm}
          onToggle={() =>
            setShowConfirm(
              (value) => !value
            )
          }
          autoComplete="new-password"
        />
      </div>

      {/* Password requirements */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Password requirements
        </p>

        <div className="mt-3 space-y-2">
          <Requirement
            valid={
              newPassword.length >= 8
            }
            text="At least 8 characters"
          />

          <Requirement
            valid={
              newPassword.length > 0 &&
              newPassword ===
                confirmPassword
            }
            text="Passwords match"
          />

          <Requirement
            valid={
              newPassword.length > 0 &&
              newPassword !==
                currentPassword
            }
            text="Different from your current password"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
        >
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0 text-red-600"
          />

          <p className="text-sm text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* Success */}
      {message && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3"
        >
          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0 text-green-600"
          />

          <p className="text-sm text-green-700">
            {message}
          </p>
        </div>
      )}

      {/* Action */}
      <div className="flex justify-end border-t border-slate-200 pt-5">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Changing Password..."
            : "Change Password"}
        </button>
      </div>

      <p className="text-xs leading-5 text-slate-400">
        You will be signed out after changing
        your password and will need to log in
        again with your new password.
      </p>
    </form>
  );
}

/* =========================================================
   PASSWORD REQUIREMENT
========================================================= */

function Requirement({
  valid,
  text,
}: {
  valid: boolean;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {valid ? (
        <CheckCircle2
          size={15}
          className="text-green-600"
        />
      ) : (
        <div className="h-3.5 w-3.5 rounded-full border-2 border-slate-300" />
      )}

      <span
        className={`text-xs ${
          valid
            ? "text-green-700"
            : "text-slate-500"
        }`}
      >
        {text}
      </span>
    </div>
  );
}