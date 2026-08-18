import type {
  RevisionBlock,
  VideoContent,
} from "@/types/article-diff";

type Props = {
  from: RevisionBlock;
  to?: RevisionBlock;
};

function getVideoContent(
  content: unknown
): VideoContent {
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

    alt:
      typeof value.alt === "string"
        ? value.alt
        : undefined,

    caption:
      typeof value.caption === "string"
        ? value.caption
        : undefined,
  };
}

function VideoContent({
  content,
}: {
  content: VideoContent;
}) {
  return (
    <div>
      {content.url ? (
        <video
          src={content.url}
          controls
          aria-label={content.alt ?? "Video"}
          className="max-h-72 w-full rounded-lg border object-contain"
        />
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-500">
          No video
        </div>
      )}

      {content.caption && (
        <p className="mt-2 text-sm text-slate-500">
          {content.caption}
        </p>
      )}

      {content.url && (
        <p className="mt-1 break-all text-xs text-slate-400">
          {content.url}
        </p>
      )}
    </div>
  );
}

export default function VideoDiff({
  from,
  to,
}: Props) {
  const oldContent = getVideoContent(
    from.content
  );

  if (!to) {
    return (
      <VideoContent
        content={oldContent}
      />
    );
  }

  const newContent = getVideoContent(
    to.content
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="mb-3 text-xs font-semibold uppercase text-red-600">
          Previous
        </p>

        <VideoContent
          content={oldContent}
        />
      </div>

      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <p className="mb-3 text-xs font-semibold uppercase text-green-600">
          New
        </p>

        <VideoContent
          content={newContent}
        />
      </div>
    </div>
  );
}