import type { RevisionBlock, ImageContent } from "@/types/article-diff";
import Image from "next/image";

type Props = {
  from: RevisionBlock;
  to?: RevisionBlock;
};

type ImageContentProps = {
  content: ImageContent;
};

function ImagePreview({
  content,
}: ImageContentProps) {
  if (!content?.url) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-500">
        No image
      </div>
    );
  }

  return (
    <Image
      src={content.url}
      alt={content.alt ?? ""}
      width={1200}
      height={800}
      className="max-h-64 w-full rounded-lg border object-contain"
    />
  );
}

function getImageContent(
  content: unknown
): ImageContent {
  if (
    typeof content !== "object" ||
    content === null
  ) {
    return {};
  }

  const value = content as Record<
    string,
    unknown
  >;

  return {
    url:
      typeof value.url === "string"
        ? value.url
        : undefined,
    caption:
      typeof value.caption === "string"
        ? value.caption
        : undefined,
    alt:
      typeof value.alt === "string"
        ? value.alt
        : undefined,
  };
}

function Property({
  label,
  from,
  to,
}: {
  label: string;
  from: string;
  to: string;
}) {
  const changed = from !== to;

  return (
    <div className="border-b border-slate-200 py-3 last:border-b-0">
      <p className="mb-1 text-xs font-semibold uppercase text-slate-500">
        {label}
      </p>

      {changed ? (
        <div className="grid gap-2 md:grid-cols-2">
          <div className="rounded bg-red-100 px-3 py-2 text-sm text-red-900 line-through">
            {from || "—"}
          </div>

          <div className="rounded bg-green-100 px-3 py-2 text-sm text-green-900">
            {to || "—"}
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-700">
          {from || "—"}
        </p>
      )}
    </div>
  );
}

export default function ImageDiff({
  from,
  to,
}: Props) {
  const oldContent = getImageContent(from.content);
  if (!to) {
    return (
      <div>
        <ImagePreview content={oldContent} />

        <div className="mt-4">
          <Property
            label="URL"
            from={String(
              oldContent.url ?? ""
            )}
            to=""
          />

          <Property
            label="Caption"
            from={String(
              oldContent.caption ?? ""
            )}
            to=""
          />

          <Property
            label="Alt text"
            from={String(
              oldContent.alt ?? ""
            )}
            to=""
          />
        </div>
      </div>
    );
  }

  const newContent = getImageContent(to.content);

  const urlChanged = oldContent.url !== newContent.url;

  const captionChanged = oldContent.caption !== newContent.caption;

  const altChanged = oldContent.alt !== newContent.alt;

  const hasChanges = urlChanged || captionChanged || altChanged;

  if (!hasChanges) {
    return (
      <div>
        <ImagePreview content={oldContent} />

        <p className="mt-3 text-sm text-slate-500">
          No image properties changed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-red-600">
            Previous
          </p>

          <ImagePreview
            content={oldContent}
          />
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-green-600">
            New
          </p>

          <ImagePreview
            content={newContent}
          />
        </div>
      </div>

      
      <div className="rounded-lg border border-slate-200">
        <Property
          label="URL"
          from={String(
            oldContent.url ?? ""
          )}
          to={String(
            newContent.url ?? ""
          )}
        />

        <Property
          label="Caption"
          from={String(
            oldContent.caption ?? ""
          )}
          to={String(
            newContent.caption ?? ""
          )}
        />

        <Property
          label="Alt text"
          from={String(
            oldContent.alt ?? ""
          )}
          to={String(
            newContent.alt ?? ""
          )}
        />
      </div>
    </div>
  );
}