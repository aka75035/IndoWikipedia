"use client";

import Link from "next/link";
import { useState } from "react";

type FeaturedArticle = {
  _id: string | { toString(): string };

  title: string;

  slug: string;

  isFeatured: boolean;

  publishedAt?: Date | string | null;

  createdBy?: {
    username?: string;
    displayName?: string;
  } | null;

  currentRevision?: {
    title?: string;
    summary?: string;
  } | null;
};

type Props = {
  articles: FeaturedArticle[];
};

export default function FeaturedArticles({
  articles,
}: Props) {
  const [items, setItems] =
    useState(articles);

  const [loadingSlug, setLoadingSlug] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  async function updateFeatured(
    slug: string,
    isFeatured: boolean
  ) {
    setLoadingSlug(slug);
    setError(null);

    try {
      const response = await fetch(
        `/api/articles/${encodeURIComponent(
          slug
        )}/featured`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isFeatured,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to update featured status"
        );
      }

    /*
     * Update local state using the
     * actual Article field.
     */
      setItems((current) =>
        current.map((article) =>
          article.slug === slug
            ? {
                ...article,
                isFeatured,
              }
            : article
        )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update featured status"
      );
    } finally {
      setLoadingSlug(null);
    }
  }

  const featuredArticles =
    items.filter(
      (article) => article.isFeatured
    );

  return (
    <section>
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-600">
          Content Curation
        </p>

        <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Featured Articles
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Choose which published articles
              appear as featured content.
            </p>
          </div>

          <span className="w-fit rounded-full bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-700">
            {featuredArticles.length} featured
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Featured articles */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold text-slate-900">
            Currently Featured
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Published articles currently
            marked as featured.
          </p>
        </div>

        {featuredArticles.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <h3 className="text-sm font-semibold text-slate-800">
              No featured articles
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Choose a published article below
              to feature it.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {featuredArticles.map(
              (article) => (
                <div
                  key={article._id.toString()}
                  className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/articles/${article.slug}`}
                      target="_blank"
                      className="font-semibold text-slate-900 hover:text-blue-600"
                    >
                      {article.title}
                    </Link>

                    <p className="mt-1 text-sm text-slate-500">
                      /{article.slug}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={
                      loadingSlug ===
                      article.slug
                    }
                    onClick={() =>
                      updateFeatured(
                        article.slug,
                        false
                      )
                    }
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loadingSlug ===
                    article.slug
                      ? "Updating..."
                      : "Remove"}
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* All published articles */}
      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold text-slate-900">
            Published Articles
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Feature or unfeature published
            articles.
          </p>
        </div>

        <div className="divide-y divide-slate-200">
          {items.map((article) => {
            const isFeatured =
              article.isFeatured === true;

            const isLoading =
              loadingSlug ===
              article.slug;

            return (
              <div
                key={article._id.toString()}
                className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <Link
                    href={`/articles/${article.slug}`}
                    target="_blank"
                    className="font-medium text-slate-900 hover:text-blue-600"
                  >
                    {article.title}
                  </Link>

                  <p className="mt-1 text-sm text-slate-500">
                    /{article.slug}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    {article.createdBy
                      ?.displayName ||
                      article.createdBy
                        ?.username ||
                      "Unknown"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {isFeatured && (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                      Featured
                    </span>
                  )}

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() =>
                      updateFeatured(
                        article.slug,
                        !isFeatured
                      )
                    }
                    className={
                      isFeatured
                        ? "rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        : "rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    }
                  >
                    {isLoading
                      ? "Updating..."
                      : isFeatured
                        ? "Remove"
                        : "Feature"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}