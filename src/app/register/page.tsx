"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      router.push("/login");
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-4 rounded-xl bg-white p-8 shadow-2xl"
      >
        <h1 className="text-2xl font-bold text-black">
          Create Account
        </h1>

        <div>
          <label
            htmlFor="name"
            className="text-black"
          >
            Name
          </label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded border p-2 text-black"
          />
        </div>

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
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded border p-2 text-black"
          />
        </div>

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
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full rounded border p-2 text-black"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="terms"
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            required
          />

          <label
            htmlFor="terms"
            className="text-black"
          >
            I agree to the Terms & Conditions
          </label>
        </div>

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/login")}
          className="text-sm text-blue-600 hover:underline"
        >
          Already have an account? Login
        </button>
      </form>
    </div>
  );
}