import Link from "next/link";
import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

import {
  getArticle,
  getRevision,
} from "@/lib/services/article.service";

import { canViewArticle } from "@/lib/services/article-permissions";

type Props = {
  params: Promise<{
    slug: string;
    version: string;
  }>;
};

export default async function RevisionPage({
  params,
}: Props) {
  const {
    slug,
    version: versionParam,
  } = await params;

  const version = Number(versionParam);

  if (
    !Number.isInteger(version) ||
    version < 1
  ) {
    notFound();
  }

  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const user = await getCurrentUser();

  if (!canViewArticle(article, user)) {
    notFound();
  }

  const revision = await getRevision(
    article._id.toString(),
    version
  );

  if (!revision) {
    notFound();
  }

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

          <Link
            href={`/article/${article.slug}/revisions`}
            className="hover:text-blue-600 hover:underline"
          >
            Revision history
          </Link>

          <span className="mx-2">›</span>

          <span className="text-slate-700">
            Version {revision.version}
          </span>
        </nav>

        {/* Header */}
        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="rounded-md bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                  Version {revision.version}
                </span>

                {revision.version ===
                  article.currentRevision?.version && (
                  <span className="rounded-md bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                    Current revision
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-slate-900">
                {revision.title}
              </h1>

              <p className="mt-2 text-slate-600">
                {revision.summary}
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/article/${article.slug}/revisions`}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                ← History
              </Link>

              {revision.version > 1 && (
                <Link
                  href={`/article/${article.slug}/compare?from=${
                    revision.version - 1
                  }&to=${revision.version}`}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Compare
                </Link>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-100 pt-4 text-sm text-slate-500">
            <span>
              Edited by{" "}
              <strong className="text-slate-700">
                {revision.createdBy?.displayName ??
                  revision.createdBy?.username ??
                  "Unknown"}
              </strong>
            </span>

            <span>
              {new Date(
                revision.createdAt
              ).toLocaleString()}
            </span>

            {revision.editSummary && (
              <span>
                Edit summary:{" "}
                <strong className="text-slate-700">
                  {revision.editSummary}
                </strong>
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">

          {/* Infobox */}
          {revision.infobox && (
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-slate-900">
                {revision.infobox.title}
              </h2>

              {revision.infobox.image && (
                <img
                  src={revision.infobox.image}
                  alt={revision.infobox.title}
                  className="mb-5 max-h-72 w-full rounded-lg object-cover"
                />
              )}

              <div className="divide-y divide-slate-100">
                {revision.infobox.fields?.map(
                  (field: any) => (
                    <div
                      key={field._id}
                      className="grid grid-cols-[140px_1fr] gap-4 py-3 text-sm"
                    >
                      <span className="font-medium text-slate-600">
                        {field.label}
                      </span>

                      <span className="text-slate-900">
                        {field.value}
                      </span>
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {/* Sections */}
          {revision.sections?.map(
            (section: any) => (
              <section
                key={section._id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 className="mb-5 border-b border-slate-100 pb-3 text-2xl font-bold text-slate-900">
                  {section.title}
                </h2>

                <div className="space-y-5">
                  {section.blocks?.map(
                    (block: any) => (
                      <RevisionBlock
                        key={block._id}
                        block={block}
                      />
                    )
                  )}
                </div>
              </section>
            )
          )}

          {/* References */}
          {revision.references?.length > 0 && (
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-bold text-slate-900">
                References
              </h2>

              <ol className="space-y-4">
                {revision.references.map(
                  (reference: any, index: number) => (
                    <li
                      key={reference._id}
                      className="text-sm"
                    >
                      <span className="mr-2 font-semibold text-slate-500">
                        [{index + 1}]
                      </span>

                      <a
                        href={reference.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {reference.title}
                      </a>

                      {reference.publisher && (
                        <span className="ml-2 text-slate-500">
                          — {reference.publisher}
                        </span>
                      )}

                      {reference.description && (
                        <p className="mt-1 ml-8 text-slate-500">
                          {reference.description}
                        </p>
                      )}
                    </li>
                  )
                )}
              </ol>
            </section>
          )}

          {/* Media */}
          {revision.media?.length > 0 && (
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-bold text-slate-900">
                Media
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                {revision.media.map(
                  (media: any) => (
                    <div
                      key={media._id}
                      className="rounded-lg border border-slate-200 p-4"
                    >
                      <p className="font-medium text-slate-900">
                        {media.title ??
                          media.type ??
                          "Media"}
                      </p>

                      {media.url && (
                        <a
                          href={media.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 block break-all text-sm text-blue-600 hover:underline"
                        >
                          {media.url}
                        </a>
                      )}
                    </div>
                  )
                )}
              </div>
            </section>
          )}
        </div>

        {/* Bottom navigation */}
        <div className="mt-8 flex justify-between">
          <Link
            href={`/article/${article.slug}/revisions`}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to revision history
          </Link>

          <Link
            href={`/article/${article.slug}`}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            View article →
          </Link>
        </div>
      </div>
    </main>
  );
}

/**
 * Render revision blocks
 */
function RevisionBlock({
  block,
}: {
  block: any;
}) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="leading-7 text-slate-700">
          {block.content}
        </p>
      );

    case "heading":
      return (
        <h3 className="text-xl font-semibold text-slate-900">
          {block.content}
        </h3>
      );

    case "quote":
      return (
        <blockquote className="border-l-4 border-slate-300 pl-4 italic text-slate-600">
          {block.content}
        </blockquote>
      );

    case "image":
      return (
        <figure>
          <img
            src={block.content.url}
            alt={
              block.content.alt ??
              block.content.caption ??
              ""
            }
            className="max-h-[500px] w-full rounded-lg object-contain"
          />

          {block.content.caption && (
            <figcaption className="mt-2 text-center text-sm text-slate-500">
              {block.content.caption}
            </figcaption>
          )}
        </figure>
      );

    case "video":
      return (
        <figure>
          <video
            controls
            className="w-full rounded-lg"
            src={block.content.url}
          />

          {block.content.caption && (
            <figcaption className="mt-2 text-center text-sm text-slate-500">
              {block.content.caption}
            </figcaption>
          )}
        </figure>
      );

    case "link":
      return (
        <a
          href={block.content.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {block.content.text ??
            block.content.url}
        </a>
      );

    case "list":
      return (
        <ul className="list-disc space-y-2 pl-6 text-slate-700">
          {block.content.map(
            (item: string, index: number) => (
              <li key={index}>{item}</li>
            )
          )}
        </ul>
      );

    case "ordered-list":
      return (
        <ol className="list-decimal space-y-2 pl-6 text-slate-700">
          {block.content.map(
            (item: string, index: number) => (
              <li key={index}>{item}</li>
            )
          )}
        </ol>
      );

    case "code":
      return (
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <div className="border-b border-slate-200 bg-slate-100 px-4 py-2 text-xs font-medium text-slate-500">
            {block.content.language}
          </div>

          <pre className="overflow-x-auto bg-slate-950 p-4 text-sm text-slate-100">
            <code>
              {block.content.code}
            </code>
          </pre>
        </div>
      );

    case "math":
      return (
        <div className="rounded-lg bg-slate-50 p-5 text-center text-xl font-medium">
          {block.content}
        </div>
      );

    case "table":
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-slate-200 text-sm">
            <thead>
              <tr className="bg-slate-50">
                {block.content.headers.map(
                  (
                    header: string,
                    index: number
                  ) => (
                    <th
                      key={index}
                      className="border border-slate-200 px-4 py-3 text-left font-semibold"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {block.content.rows.map(
                (
                  row: string[],
                  rowIndex: number
                ) => (
                  <tr key={rowIndex}>
                    {row.map(
                      (
                        cell: string,
                        cellIndex: number
                      ) => (
                        <td
                          key={cellIndex}
                          className="border border-slate-200 px-4 py-3"
                        >
                          {cell}
                        </td>
                      )
                    )}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      );

    default:
      return (
        <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
          Unsupported block type:{" "}
          {block.type}
        </div>
      );
  }
}