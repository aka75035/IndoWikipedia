"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateArticleForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          article: {
            title,
            slug,
          },

          revision: {
            title,
            summary: "",
            sections: [],
            infobox: null,
            references: [],
            categories: [],
            editSummary: "Initial creation",
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Failed to create article"
        );
        return;
      }

      router.push(
        `/dashboard/contributor/articles/${data.article.slug}/edit`
      );
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
      className="space-y-6"
    >
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Article title
        </label>

        <input
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          placeholder="e.g. History of India"
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          required
          maxLength={300}
        />
      </div>

      {/* Slug */}
      <div>
        <label
          htmlFor="slug"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          URL slug
        </label>

        <input
          id="slug"
          name="slug"
          type="text"
          value={slug}
          onChange={(event) =>
            setSlug(
              event.target.value.toLowerCase()
            )
          }
          placeholder="e.g. history-of-india"
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          required
          maxLength={300}
        />

        <p className="mt-2 text-xs text-slate-500">
          Use lowercase letters, numbers, and
          hyphens.
        </p>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Creating..."
            : "Create Article"}
        </button>
      </div>
    </form>
  );
}