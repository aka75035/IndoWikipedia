import Link from "next/link";
import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

import {
  getArticle,
  getRevision,
} from "@/lib/services/article.service";

import { canViewArticle } from "@/lib/services/article-permissions";
import Image from "next/image";

type Props = {
  params: Promise<{
    slug: string;
    version: string;
  }>;
};

type RevisionField = {
  _id?: string;
  label?: string;
  value?: unknown;
};

type RevisionReference = {
  _id?: string;
  title?: string;
  url?: string;
  publisher?: string;
  description?: string;
};

type ImageContent = {
  url?: string;
  alt?: string;
  caption?: string;
};

type VideoContent = {
  url?: string;
  caption?: string;
};

type LinkContent = {
  url?: string;
  text?: string;
};

type CodeContent = {
  language?: string;
  code?: string;
};

type TableContent = {
  headers?: string[];
  rows?: string[][];
};

type RevisionBlock = {
  _id?: string;
  type: string;
  content: unknown;
};

type RevisionSection = {
  _id?: string;
  title: string;
  blocks?: RevisionBlock[];
};

type RevisionMedia = {
  _id?: string;
  title?: string;
  type?: string;
  url?: string;
};

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null
  );
}

function getImageContent(
  content: unknown
): ImageContent {
  if (!isRecord(content)) {
    return {};
  }

  return {
    url:
      typeof content.url === "string"
        ? content.url
        : undefined,

    alt:
      typeof content.alt === "string"
        ? content.alt
        : undefined,

    caption:
      typeof content.caption === "string"
        ? content.caption
        : undefined,
  };
}

function getVideoContent(
  content: unknown
): VideoContent {
  if (!isRecord(content)) {
    return {};
  }

  return {
    url:
      typeof content.url === "string"
        ? content.url
        : undefined,

    caption:
      typeof content.caption === "string"
        ? content.caption
        : undefined,
  };
}

function getLinkContent(
  content: unknown
): LinkContent {
  if (!isRecord(content)) {
    return {};
  }

  return {
    url:
      typeof content.url === "string"
        ? content.url
        : undefined,

    text:
      typeof content.text === "string"
        ? content.text
        : undefined,
  };
}

function getCodeContent(
  content: unknown
): CodeContent {
  if (!isRecord(content)) {
    return {};
  }

  return {
    language:
      typeof content.language === "string"
        ? content.language
        : undefined,

    code:
      typeof content.code === "string"
        ? content.code
        : undefined,
  };
}

function getTableContent(
  content: unknown
): TableContent {
  if (!isRecord(content)) {
    return {};
  }

  const headers = Array.isArray(
    content.headers
  )
    ? content.headers.filter(
        (header): header is string =>
          typeof header === "string"
      )
    : [];

  const rows = Array.isArray(
    content.rows
  )
    ? content.rows.map((row) =>
        Array.isArray(row)
          ? row.filter(
              (cell): cell is string =>
                typeof cell === "string"
            )
          : []
      )
    : [];

  return {
    headers,
    rows,
  };
}

function getStringArray(
  content: unknown
): string[] {
  if (!Array.isArray(content)) {
    return [];
  }

  return content.filter(
    (item): item is string =>
      typeof item === "string"
  );
}

function getStringContent(
  content: unknown
): string {
  return typeof content === "string"
    ? content
    : String(content ?? "");
}

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

  const sections =
    (revision.sections ?? []) as RevisionSection[];

  const references =
    (revision.references ??
      []) as RevisionReference[];

  const media =
    (revision.media ?? []) as RevisionMedia[];

  const infobox = revision.infobox as
    | {
        title?: string;
        image?: string;
        fields?: RevisionField[];
      }
    | undefined;

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
                  article.currentRevision
                    ?.version && (
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
                {revision.createdBy
                  ?.displayName ??
                  revision.createdBy
                    ?.username ??
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
          {infobox && (
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-slate-900">
                {infobox.title}
              </h2>

              {infobox.image && (
                <Image
                  src={infobox.image}
                  alt={infobox.title ?? ""}
                  width={800}
                  height={450}
                  className="mb-5 max-h-72 w-full rounded-lg object-cover"
                />
              )}

              <div className="divide-y divide-slate-100">
                {infobox.fields?.map(
                  (field, index) => (
                    <div
                      key={
                        field._id ??
                        `field-${index}`
                      }
                      className="grid grid-cols-[140px_1fr] gap-4 py-3 text-sm"
                    >
                      <span className="font-medium text-slate-600">
                        {field.label}
                      </span>

                      <span className="text-slate-900">
                        {String(
                          field.value ?? ""
                        )}
                      </span>
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {/* Sections */}
          {sections.map(
            (section, sectionIndex) => (
              <section
                key={
                  section._id ??
                  `section-${sectionIndex}`
                }
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 className="mb-5 border-b border-slate-100 pb-3 text-2xl font-bold text-slate-900">
                  {section.title}
                </h2>

                <div className="space-y-5">
                  {section.blocks?.map(
                    (block, blockIndex) => (
                      <RevisionBlock
                        key={
                          block._id ??
                          `block-${blockIndex}`
                        }
                        block={block}
                      />
                    )
                  )}
                </div>
              </section>
            )
          )}

          {/* References */}
          {references.length > 0 && (
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-bold text-slate-900">
                References
              </h2>

              <ol className="space-y-4">
                {references.map(
                  (reference, index) => (
                    <li
                      key={
                        reference._id ??
                        `reference-${index}`
                      }
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
                          —{" "}
                          {reference.publisher}
                        </span>
                      )}

                      {reference.description && (
                        <p className="mt-1 ml-8 text-slate-500">
                          {
                            reference.description
                          }
                        </p>
                      )}
                    </li>
                  )
                )}
              </ol>
            </section>
          )}

          {/* Media */}
          {media.length > 0 && (
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-bold text-slate-900">
                Media
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                {media.map(
                  (item, index) => (
                    <div
                      key={
                        item._id ??
                        `media-${index}`
                      }
                      className="rounded-lg border border-slate-200 p-4"
                    >
                      <p className="font-medium text-slate-900">
                        {item.title ??
                          item.type ??
                          "Media"}
                      </p>

                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 block break-all text-sm text-blue-600 hover:underline"
                        >
                          {item.url}
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
 * Render revision blocks.
 */
function RevisionBlock({
  block,
}: {
  block: RevisionBlock;
}) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="leading-7 text-slate-700">
          {getStringContent(block.content)}
        </p>
      );

    case "heading":
      return (
        <h3 className="text-xl font-semibold text-slate-900">
          {getStringContent(block.content)}
        </h3>
      );

    case "quote":
      return (
        <blockquote className="border-l-4 border-slate-300 pl-4 italic text-slate-600">
          {getStringContent(block.content)}
        </blockquote>
      );

    case "image": {
      const content =
        getImageContent(block.content);

      return (
        <figure>
          <Image
            src={content.url ?? ""}
            alt={
              content.alt ??
              content.caption ??
              ""
            }
            width={1200}
            height={800}
            className="max-h-[500px] w-full rounded-lg object-contain"
          />

          {content.caption && (
            <figcaption className="mt-2 text-center text-sm text-slate-500">
              {content.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case "video": {
      const content =
        getVideoContent(block.content);

      return (
        <figure>
          <video
            controls
            className="w-full rounded-lg"
            src={content.url}
          />

          {content.caption && (
            <figcaption className="mt-2 text-center text-sm text-slate-500">
              {content.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case "link": {
      const content =
        getLinkContent(block.content);

      return (
        <a
          href={content.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {content.text ??
            content.url ??
            ""}
        </a>
      );
    }

    case "list": {
      const items = getStringArray(
        block.content
      );

      return (
        <ul className="list-disc space-y-2 pl-6 text-slate-700">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    }

    case "ordered-list": {
      const items = getStringArray(
        block.content
      );

      return (
        <ol className="list-decimal space-y-2 pl-6 text-slate-700">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      );
    }

    case "code": {
      const content =
        getCodeContent(block.content);

      return (
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <div className="border-b border-slate-200 bg-slate-100 px-4 py-2 text-xs font-medium text-slate-500">
            {content.language ?? ""}
          </div>

          <pre className="overflow-x-auto bg-slate-950 p-4 text-sm text-slate-100">
            <code>{content.code ?? ""}</code>
          </pre>
        </div>
      );
    }

    case "math":
      return (
        <div className="rounded-lg bg-slate-50 p-5 text-center text-xl font-medium">
          {getStringContent(block.content)}
        </div>
      );

    case "table": {
      const content =
        getTableContent(block.content);

      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-slate-200 text-sm">
            <thead>
              <tr className="bg-slate-50">
                {(content.headers ?? []).map(
                  (header, index) => (
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
              {(content.rows ?? []).map(
                (row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map(
                      (cell, cellIndex) => (
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
    }

    default:
      return (
        <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
          Unsupported block type:{" "}
          {block.type}
        </div>
      );
  }
}