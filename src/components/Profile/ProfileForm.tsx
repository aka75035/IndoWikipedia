"use client";

import { useState } from "react";

import type { ProfileUser } from "@/types/profile";

type Props = {
  user: ProfileUser;
  onUserUpdate?: (user: ProfileUser) => void;
};

export default function ProfileForm({
  user,
  onUserUpdate,
}: Props) {
  const [displayName, setDisplayName] =
    useState(user.displayName);

  const [bio, setBio] =
    useState(user.bio ?? "");

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "/api/auth/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            displayName,
            bio,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to update profile"
        );
        return;
      }

      onUserUpdate?.(data.user);

      setDisplayName(
        data.user.displayName
      );

      setBio(data.user.bio ?? "");

      setMessage(
        "Profile updated successfully."
      );
    } catch {
      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Display Name */}
      <div>
        <label
          htmlFor="displayName"
          className="text-sm font-medium text-slate-700"
        >
          Display Name
        </label>

        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) =>
            setDisplayName(e.target.value)
          }
          required
          maxLength={100}
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Username */}
      <div>
        <label
          htmlFor="username"
          className="text-sm font-medium text-slate-700"
        >
          Username
        </label>

        <input
          id="username"
          value={user.username}
          disabled
          className="mt-2 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500"
        />

        <p className="mt-1 text-xs text-slate-400">
          Username cannot be changed.
        </p>
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="text-sm font-medium text-slate-700"
        >
          Email
        </label>

        <input
          id="email"
          value={user.email}
          disabled
          className="mt-2 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500"
        />

        <p className="mt-1 text-xs text-slate-400">
          Email cannot be changed here.
        </p>
      </div>

      {/* Bio */}
      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="bio"
            className="text-sm font-medium text-slate-700"
          >
            Bio
          </label>

          <span className="text-xs text-slate-400">
            {bio.length}/1000
          </span>
        </div>

        <textarea
          id="bio"
          value={bio}
          onChange={(e) =>
            setBio(e.target.value)
          }
          maxLength={1000}
          rows={6}
          placeholder="Tell people about yourself..."
          className="mt-2 w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Success */}
      {message && (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {message}
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : "Save Changes"}
        </button>
      </div>
    </form>
  );
}