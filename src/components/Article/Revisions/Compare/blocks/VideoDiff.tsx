type Props = {
  from: any;
  to?: any;
};

function ImageContent({ block }: { block: any }) {
  const content = block.content;

  return (
    <div>
      <img
        src={content.url}
        alt={content.alt || ""}
        className="max-h-72 w-full rounded-lg border object-contain"
      />

      {content.caption && (
        <p className="mt-2 text-sm text-slate-500">
          {content.caption}
        </p>
      )}

      <p className="mt-1 break-all text-xs text-slate-400">
        {content.url}
      </p>
    </div>
  );
}

export default function ImageDiff({
  from,
  to,
}: Props) {
  if (!to) {
    return <ImageContent block={from} />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="mb-3 text-xs font-semibold uppercase text-red-600">
          Previous
        </p>

        <ImageContent block={from} />
      </div>

      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <p className="mb-3 text-xs font-semibold uppercase text-green-600">
          New
        </p>

        <ImageContent block={to} />
      </div>
    </div>
  );
}