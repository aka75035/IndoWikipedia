import type { RevisionBlock } from "@/types/article-diff";

type Props = {
  from: RevisionBlock;
  to?: RevisionBlock;
};

type ItemStatus =
  | "same"
  | "added"
  | "removed";

function normalize(value: unknown): string {
  return String(value ?? "").trim();
}

function getListItems(
  content: unknown
): string[] {
  if (!Array.isArray(content)) {
    return [];
  }

  return content.map((item) =>
    String(item ?? "")
  );
}

function compareItems(
  fromItems: string[],
  toItems: string[]
) {
  const removed: string[] = [];
  const added: string[] = [];
  const same: string[] = [];

  const usedFrom = new Set<number>();
  const usedTo = new Set<number>();

  /*
   * Match identical items first.
   */
  for (let i = 0; i < toItems.length; i++) {
    const toItem = normalize(toItems[i]);

    const fromIndex = fromItems.findIndex(
      (item, index) =>
        !usedFrom.has(index) &&
        normalize(item) === toItem
    );

    if (fromIndex !== -1) {
      usedFrom.add(fromIndex);
      usedTo.add(i);
      same.push(toItems[i]);
    }
  }

  /*
   * Remaining old items were removed.
   */
  fromItems.forEach((item, index) => {
    if (!usedFrom.has(index)) {
      removed.push(item);
    }
  });

  /*
   * Remaining new items were added.
   */
  toItems.forEach((item, index) => {
    if (!usedTo.has(index)) {
      added.push(item);
    }
  });

  return {
    same,
    added,
    removed,
  };
}

function renderList(
  items: string[],
  ordered: boolean,
  status: ItemStatus
) {
  const ListTag = ordered ? "ol" : "ul";

  return (
    <ListTag
      className={`space-y-2 ${
        ordered
          ? "list-decimal"
          : "list-disc"
      } pl-6`}
    >
      {items.map((item, index) => (
        <li
          key={`${status}-${index}-${item}`}
          className={
            status === "added"
              ? "rounded bg-green-100 px-2 py-1 text-green-900"
              : status === "removed"
                ? "rounded bg-red-100 px-2 py-1 text-red-900 line-through"
                : "text-slate-700"
          }
        >
          {item}
        </li>
      ))}
    </ListTag>
  );
}

export default function ListDiff({
  from,
  to,
}: Props) {
  const oldItems = getListItems(
    from.content
  );

  const newItems = to
    ? getListItems(to.content)
    : [];

  const ordered =
    from.type === "ordered-list" ||
    to?.type === "ordered-list";

  /*
   * Removed list.
   */
  if (!to) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="mb-3 text-xs font-semibold uppercase text-red-700">
          Removed list
        </p>

        {renderList(
          oldItems,
          ordered,
          "removed"
        )}
      </div>
    );
  }

  const result = compareItems(
    oldItems,
    newItems
  );

  const typeChanged =
    from.type !== to.type;

  const hasChanges =
    typeChanged ||
    result.added.length > 0 ||
    result.removed.length > 0;

  if (!hasChanges) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        {renderList(
          oldItems,
          ordered,
          "same"
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {typeChanged && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
          <p className="text-xs font-semibold uppercase text-blue-700">
            List type changed
          </p>

          <p className="mt-1 text-sm text-slate-700">
            {from.type} → {to.type}
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="mb-3 text-xs font-semibold uppercase text-red-700">
            Previous
          </p>

          {renderList(
            oldItems,
            from.type === "ordered-list",
            "same"
          )}

          {result.removed.length > 0 && (
            <div className="mt-4 border-t border-red-200 pt-4">
              <p className="mb-2 text-xs font-semibold text-red-700">
                Removed items
              </p>

              {renderList(
                result.removed,
                from.type === "ordered-list",
                "removed"
              )}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="mb-3 text-xs font-semibold uppercase text-green-700">
            New
          </p>

          {renderList(
            newItems,
            to.type === "ordered-list",
            "same"
          )}

          {result.added.length > 0 && (
            <div className="mt-4 border-t border-green-200 pt-4">
              <p className="mb-2 text-xs font-semibold text-green-700">
                Added items
              </p>

              {renderList(
                result.added,
                to.type === "ordered-list",
                "added"
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}