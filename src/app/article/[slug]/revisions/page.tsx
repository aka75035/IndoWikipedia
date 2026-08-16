import Link from "next/link";
import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

import {
  getArticle,
  getArticleRevisions,
} from "@/lib/services/article.service";

import { canViewArticle } from "@/lib/services/article-permissions";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

type Revision = {
  _id: string;
  version: number;
  title: string;
  summary: string;
  editSummary?: string;
  createdAt: string;
  createdBy?: {
    username: string;
    displayName: string;
    avatar: string | null;
  };
};

export default async function RevisionHistoryPage({
  params,
}: Props) {
  const { slug } = await params;

  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const user = await getCurrentUser();

  if (!canViewArticle(article, user)) {
    notFound();
  }

  const result = await getArticleRevisions(
    article._id.toString(),
    1
  );

  const revisions =
    result.revisions as Revision[];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-slate-500">
          <Link
            href={`/article/${article.slug}`}
            className="hover:text-blue-600 hover:underline"
          >
            {article.title}
          </Link>

          <span className="mx-2">›</span>

          <span className="text-slate-700">
            Revision history
          </span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Revision history
              </h1>

              <p className="mt-2 text-sm text-slate-600">
                History of changes made to{" "}
                <span className="font-medium text-slate-900">
                  {article.title}
                </span>
              </p>
            </div>

            <Link
              href={`/article/${article.slug}`}
              className="inline-flex w-fit items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
            >
              ← Back to article
            </Link>
          </div>
        </div>

        {/* Revision count */}
        <div className="mb-5 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Revision history
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {result.total}{" "}
                {result.total === 1
                  ? "revision"
                  : "revisions"}
              </p>
            </div>

            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {article.status}
            </div>
          </div>
        </div>

        {/* Empty state */}
        {revisions.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
              ↶
            </div>

            <h2 className="text-lg font-semibold text-slate-900">
              No revisions found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              This article does not have any revision history yet.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

            {/* Table header */}
            <div className="hidden grid-cols-[100px_1fr_180px_150px] border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
              <div>Version</div>
              <div>Change</div>
              <div>Editor</div>
              <div className="text-right">
                Actions
              </div>
            </div>

            {/* Revisions */}
            <div className="divide-y divide-slate-200">
              {revisions.map((revision) => (
                <div
                  key={revision._id}
                  className="grid gap-4 px-5 py-5 transition hover:bg-slate-50 md:grid-cols-[100px_1fr_180px_150px] md:items-center"
                >

                  {/* Version */}
                  <div>
                    <span className="inline-flex rounded-md bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-700">
                      v{revision.version}
                    </span>
                  </div>

                  {/* Change */}
                  <div className="min-w-0">
                    <Link
                      href={`/article/${article.slug}/revisions/${revision.version}`}
                      className="font-semibold text-slate-900 hover:text-blue-600 hover:underline"
                    >
                      {revision.editSummary ||
                        "Revision"}
                    </Link>

                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                      {revision.summary}
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      {new Date(
                        revision.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>

                  {/* Editor */}
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {revision.createdBy?.displayName ??
                        revision.createdBy?.username ??
                        "Unknown"}
                    </p>

                    {revision.createdBy?.username && (
                      <p className="mt-0.5 text-xs text-slate-400">
                        @{revision.createdBy.username}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 md:justify-end">
                    <Link
                      href={`/article/${article.slug}/revisions/${revision.version}`}
                      className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                      View
                    </Link>

                    {revision.version > 1 && (
                      <Link
                        href={`/article/${article.slug}/compare?from=${
                          revision.version - 1
                        }&to=${revision.version}`}
                        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                      >
                        Compare
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        {result.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-sm text-slate-500">
              Page {result.page} of{" "}
              {result.totalPages}
            </p>

            <div className="flex gap-2">
              {result.page > 1 && (
                <Link
                  href={`/article/${article.slug}/revisions?page=${
                    result.page - 1
                  }`}
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Previous
                </Link>
              )}

              {result.page <
                result.totalPages && (
                <Link
                  href={`/article/${article.slug}/revisions?page=${
                    result.page + 1
                  }`}
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}