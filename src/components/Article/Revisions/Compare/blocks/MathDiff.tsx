import type { RevisionBlock } from "@/types/article-diff";

type Props = {
  from: RevisionBlock;
  to?: RevisionBlock;
};

function MathBox({
  value,
  type,
}: {
  value: string;
  type?: "added" | "removed";
}) {
  const className =
    type === "added"
      ? "border-green-200 bg-green-50 text-green-900"
      : type === "removed"
        ? "border-red-200 bg-red-50 text-red-900"
        : "border-slate-200 bg-slate-50 text-slate-900";

  return (
    <div
      className={`rounded-lg border p-5 ${className}`}
    >
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-60">
        Mathematical expression
      </div>

      <div className="overflow-x-auto font-mono text-lg">
        {value}
      </div>
    </div>
  );
}

export default function MathDiff({
  from,
  to,
}: Props) {
  const oldValue = String(
    from.content ?? ""
  );

  const newValue = String(
    to?.content ?? ""
  );

  /*
   * Removed math block.
   */
  if (!to) {
    return (
      <div className="space-y-3">
        <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
          Removed
        </span>

        <MathBox
          value={oldValue}
          type="removed"
        />
      </div>
    );
  }

  /*
   * No change.
   */
  if (oldValue === newValue) {
    return (
      <MathBox value={oldValue} />
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
          Modified
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-red-700">
            Previous
          </p>

          <MathBox
            value={oldValue}
            type="removed"
          />
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-green-700">
            New
          </p>

          <MathBox
            value={newValue}
            type="added"
          />
        </div>
      </div>
    </div>
  );
}