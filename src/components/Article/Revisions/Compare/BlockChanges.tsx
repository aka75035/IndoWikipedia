import ChangeBadge from "./ChangeBadge";
import BlockRenderer from "./BlockRenderer";

type Props = {
  changes: {
    added?: any[];
    removed?: any[];
    modified?: any[];
  };
};

export default function BlockChanges({
  changes,
}: Props) {
  const added = changes?.added ?? [];
  const removed = changes?.removed ?? [];
  const modified = changes?.modified ?? [];

  const hasChanges =
    added.length ||
    removed.length ||
    modified.length;

  if (!hasChanges) {
    return null;
  }

  return (
    <div className="space-y-5">

      {/* Added */}
      {added.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <ChangeBadge type="added">
              Added
            </ChangeBadge>

            <span className="text-xs text-slate-500">
              {added.length} block
              {added.length !== 1
                ? "s"
                : ""}
            </span>
          </div>

          <div className="space-y-3">
            {added.map(
              (block, index) => (
                <div
                  key={
                    block._id ?? index
                  }
                  className="rounded-lg border border-green-200 bg-white p-4"
                >
                  <BlockRenderer
                    block={block}
                  />
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Removed */}
      {removed.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <ChangeBadge type="removed">
              Removed
            </ChangeBadge>

            <span className="text-xs text-slate-500">
              {removed.length} block
              {removed.length !== 1
                ? "s"
                : ""}
            </span>
          </div>

          <div className="space-y-3">
            {removed.map(
              (block, index) => (
                <div
                  key={
                    block._id ?? index
                  }
                  className="rounded-lg border border-red-200 bg-white p-4"
                >
                  <BlockRenderer
                    block={block}
                  />
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Modified */}
      {modified.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <ChangeBadge type="modified">
              Modified
            </ChangeBadge>

            <span className="text-xs text-slate-500">
              {modified.length} block
              {modified.length !== 1
                ? "s"
                : ""}
            </span>
          </div>

          <div className="space-y-4">
            {modified.map(
              (change, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-blue-200 bg-white p-4"
                >
                  <BlockRenderer
                    block={change.from}
                    compareWith={
                      change.to
                    }
                  />
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}