"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";


export default function SignUpForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            displayName,
            email,
            password,
            terms:checked,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const message =
          data.errors?.[0]?.message ||
          data.message ||
          "Registration failed";

        setError(message);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }
  function handleOutsideClick(e: MouseEvent<HTMLDivElement>) {
  if (e.target === e.currentTarget) {
    router.back();
  }
}

  return (
    <main
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleOutsideClick}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-4 rounded-xl bg-white p-8 shadow-2xl"
      >
        <h1 className="text-2xl font-bold text-black">
          Create Account
        </h1>

        {/* Username */}
        <div>
          <label
            htmlFor="username"
            className="text-black"
          >
            Username
          </label>

          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            required
            minLength={3}
            maxLength={50}
            pattern="[a-zA-Z0-9_]+"
            className="w-full rounded border p-2 text-black"
            placeholder="e.g. akash_75035"
          />
        </div>

        {/* Display Name */}
        <div>
          <label
            htmlFor="displayName"
            className="text-black"
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
            className="w-full rounded border p-2 text-black"
            placeholder="Your name"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="text-black"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            className="w-full rounded border p-2 text-black"
            placeholder="you@example.com"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="text-black"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
            minLength={8}
            className="w-full rounded border p-2 text-black"
            placeholder="At least 8 characters"
          />
        </div>

        {/* Terms */}
        <div className="flex items-center gap-2">
          <input
            id="terms"
            type="checkbox"
            checked={checked}
            onChange={(e) =>
              setChecked(e.target.checked)
            }
            required
          />

          <label
            htmlFor="terms"
            className="text-black"
          >
            I agree to the Terms & Conditions
          </label>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? "Creating account..."
            : "Sign Up"}
        </button>

        {/* Login */}
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="text-sm text-blue-600 hover:underline"
        >
          Already have an account? Login
        </button>
      </form>
    </div>
    </main>
  );
}