"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  slug: string;
};

export default function ArticleReviewActions({
  slug,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState<
    "publish" | "changes" | null
  >(null);

  const [error, setError] =
    useState<string | null>(null);

  async function handlePublish() {
    const confirmed = window.confirm(
      "Are you sure you want to approve and publish this article?"
    );

    if (!confirmed) {
      return;
    }

    setLoading("publish");
    setError(null);

    try {
      /*
       * Use your EXISTING publish route.
       *
       * Change this URL only if your current
       * publish route uses a different path.
       */
      const response = await fetch(
        `/api/articles/${encodeURIComponent(slug)}/publish`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to publish article"
        );
      }

      /*
       * Article is now published.
       */
      router.push(`/articles/${slug}`);
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to publish article"
      );
    } finally {
      setLoading(null);
    }
  }

  async function handleRequestChanges() {
    const confirmed = window.confirm(
      "Send this article back to the contributor for changes?"
    );

    if (!confirmed) {
      return;
    }

    setLoading("changes");
    setError(null);

    try {
      const response = await fetch(
        `/api/articles/${encodeURIComponent(
          slug
        )}/request-changes`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to request changes"
        );
      }

      /*
       * Article is now draft.
       */
      router.push(
        `/dashboard/editor`
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to request changes"
      );
    } finally {
      setLoading(null);
    }
  }

  const isLoading =
    loading !== null;

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleRequestChanges}
          disabled={isLoading}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading === "changes"
            ? "Sending..."
            : "Request Changes"}
        </button>

        <button
          type="button"
          onClick={handlePublish}
          disabled={isLoading}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading === "publish"
            ? "Publishing..."
            : "Approve & Publish"}
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="max-w-sm text-right text-xs text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}