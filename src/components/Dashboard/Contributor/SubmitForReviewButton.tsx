"use client";

import { useState } from "react";

type Props = {
  slug: string;
};

export default function SubmitForReviewButton({
  slug,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/articles/${slug}/submit`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to submit article"
        );
      }

      setMessage(
        "Submitted successfully."
      );

      // Refresh the Server Component
      window.location.reload();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to submit article."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Submitting..."
          : "Submit for Review"}
      </button>

      {message && (
        <p className="text-xs text-slate-500">
          {message}
        </p>
      )}
    </div>
  );
}