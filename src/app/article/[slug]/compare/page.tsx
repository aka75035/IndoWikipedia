import Link from "next/link";

import {
  getArticle,
  getRevision,
  compareRevisions,
} from "@/lib/services/article.service";

import { getCurrentUser } from "@/lib/auth";
import { canViewArticle } from "@/lib/services/article-permissions";

import SectionChanges from "@/components/Article/Revisions/Compare/SectionChanges";
import InfoboxChanges from "@/components/Article/Revisions/Compare/InfoboxChanges";
import ReferenceChanges from "@/components/Article/Revisions/Compare/ReferenceChanges";

type Props = {
  params: Promise<{
    slug: string;
  }>;

  searchParams: Promise<{
    from?: string;
    to?: string;
  }>;
};


function displayValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "—";
  }

  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint"
  ) {
    return String(value);
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}



function getCategoryLabel(category: unknown): string {
  if (typeof category === "string") {
    return category;
  }

  if (
    typeof category === "object" &&
    category !== null
  ) {
    const value = category as Record<
      string,
      unknown
    >;

    if (typeof value.name === "string") {
      return value.name;
    }

    if (typeof value.title === "string") {
      return value.title;
    }
  }

  try {
    return JSON.stringify(category);
  } catch {
    return String(category);
  }
}

export default async function ComparePage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const query = await searchParams;

  const fromParam = query.from;
  const toParam = query.to;

  /*
   * Validate query parameters.
   */
  const from = Number(fromParam);
  const to = Number(toParam);

  if (
    !fromParam ||
    !toParam ||
    !Number.isInteger(from) ||
    !Number.isInteger(to) ||
    from < 1 ||
    to < 1 ||
    from === to
  ) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-semibold text-red-900">
            Invalid revision comparison
          </h1>

          <p className="mt-2 text-sm text-red-700">
            Please provide two different valid
            revision numbers.
          </p>

          <Link
            href={`/article/${slug}/revisions`}
            className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Back to revision history
          </Link>
        </div>
      </main>
    );
  }

  /*
   * Get article.
   */
  const article = await getArticle(slug);

  if (!article) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h1 className="text-xl font-semibold text-slate-900">
            Article not found
          </h1>

          <Link
            href="/"
            className="mt-4 inline-flex text-sm font-medium text-blue-600 hover:underline"
          >
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  /*
   * Visibility permission.
   */
  const user = await getCurrentUser();

  if (!canViewArticle(article, user)) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h1 className="text-xl font-semibold text-slate-900">
            Article not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            You don&apos;t have permission to view this
            article.
          </p>
        </div>
      </main>
    );
  }

  /*
   * Fetch both revisions.
   */
  const [
    fromRevision,
    toRevision,
  ] = await Promise.all([
    getRevision(
      article._id.toString(),
      from
    ),
    getRevision(
      article._id.toString(),
      to
    ),
  ]);

  if (!fromRevision || !toRevision) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-semibold text-red-900">
            Revision not found
          </h1>

          <p className="mt-2 text-sm text-red-700">
            One or both of the requested revisions
            don&apos;t exist.
          </p>

          <Link
            href={`/article/${slug}/revisions`}
            className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Back to revision history
          </Link>
        </div>
      </main>
    );
  }

  /*
   * Generate the actual diff.
   */
  const changes = compareRevisions(
    fromRevision,
    toRevision
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Back navigation */}
        <div className="mb-6">
          <Link
            href={`/article/${slug}/revisions`}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            ← Revision history
          </Link>
        </div>

        {/* Header */}
        <header className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Article comparison
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                {article.title}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Compare revision {from} with revision{" "}
                {to}.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-red-600">
                  Previous
                </p>

                <p className="text-lg font-bold text-red-900">
                  {from}
                </p>
              </div>

              <span className="text-slate-400">
                →
              </span>

              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-green-600">
                  New
                </p>

                <p className="text-lg font-bold text-green-900">
                  {to}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Comparison */}
        <div className="space-y-6">

          {/* Title */}
          {changes.title?.changed && (
            <section className="rounded-xl border border-blue-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Title
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="mb-1 text-xs font-semibold uppercase text-red-600">
                    Previous
                  </p>

                  <p className="text-sm text-red-900 line-through">
                    {displayValue(changes.title.from)}
                  </p>
                </div>

                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <p className="mb-1 text-xs font-semibold uppercase text-green-600">
                    New
                  </p>

                  <p className="text-sm text-green-900">
                    {displayValue(changes.title.to)}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Summary */}
          {changes.summary?.changed && (
            <section className="rounded-xl border border-blue-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Summary
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase text-red-600">
                    Previous
                  </p>

                  <p className="text-sm leading-6 text-red-900">
                    {displayValue(changes.summary.from)}
                  </p>
                </div>

                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase text-green-600">
                    New
                  </p>

                  <p className="text-sm leading-6 text-green-900">
                    {displayValue(changes.summary.to)}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Infobox */}
          <InfoboxChanges
            changes={changes.infobox}
          />

          {/* Sections */}
          <SectionChanges
            changes={changes.sections}
          />

          {/* References */}
          <ReferenceChanges
            changes={changes.references}
          />

          {/* Categories */}
          {(changes.categories.added?.length >
            0 ||
            changes.categories.removed?.length >
              0) && (
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Categories
              </h2>

              <div className="space-y-4">
                {changes.categories.added?.length >
                  0 && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase text-green-700">
                      Added
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {changes.categories.added.map(
                        (
                          category: unknown,
                          index: number
                        ) => (
                          <span
                            key={`added-${index}`}
                            className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800"
                          >
                            {getCategoryLabel(
                              category
                            )}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

                {changes.categories.removed?.length >
                  0 && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase text-red-700">
                      Removed
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {changes.categories.removed.map(
                        (
                          category: unknown,
                          index: number
                        ) => (
                          <span
                            key={`removed-${index}`}
                            className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-800 line-through"
                          >
                            {getCategoryLabel(
                              category
                            )}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Media */}
          {(changes.media.added?.length >
            0 ||
            changes.media.removed?.length >
              0) && (
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Media
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                {changes.media.added?.length >
                  0 && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <p className="mb-3 text-xs font-semibold uppercase text-green-700">
                      Added
                    </p>

                    <pre className="overflow-x-auto text-xs text-green-900">
                      {JSON.stringify(
                        changes.media.added,
                        null,
                        2
                      )}
                    </pre>
                  </div>
                )}

                {changes.media.removed?.length >
                  0 && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="mb-3 text-xs font-semibold uppercase text-red-700">
                      Removed
                    </p>

                    <pre className="overflow-x-auto text-xs text-red-900">
                      {JSON.stringify(
                        changes.media.removed,
                        null,
                        2
                      )}
                    </pre>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* No changes */}
          {!changes.title?.changed &&
            !changes.summary?.changed &&
            !changes.infobox?.changed &&
            !changes.sections?.added?.length &&
            !changes.sections?.removed?.length &&
            !changes.sections?.modified?.length &&
            !changes.references?.added?.length &&
            !changes.references?.removed?.length &&
            !changes.references?.modified?.length &&
            !changes.categories?.added?.length &&
            !changes.categories?.removed?.length &&
            !changes.media?.added?.length &&
            !changes.media?.removed?.length && (
              <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <p className="font-medium text-slate-900">
                  No changes found
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  These two revisions contain the
                  same content.
                </p>
              </div>
            )}
        </div>
      </div>
    </main>
  );
}