import type { RevisionBlock } from "@/types/article-diff";

type Props = {
  from: RevisionBlock;
  to?: RevisionBlock;
};

type TableContent = {
  headers?: string[];
  rows?: string[][];
};

function getTableContent(
  content: unknown
): TableContent {
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

  const headers = Array.isArray(
    value.headers
  )
    ? value.headers.map((header) =>
        String(header ?? "")
      )
    : undefined;

  const rows = Array.isArray(value.rows)
    ? value.rows.map((row) =>
        Array.isArray(row)
          ? row.map((cell) =>
              String(cell ?? "")
            )
          : []
      )
    : undefined;

  return {
    headers,
    rows,
  };
}

function normalize(value: unknown): string {
  return String(value ?? "").trim();
}

function Cell({
  value,
  changed,
  type,
}: {
  value: unknown;
  changed?: boolean;
  type?: "added" | "removed";
}) {
  let className =
    "border border-slate-200 px-3 py-2 text-sm text-slate-700";

  if (
    changed &&
    type === "removed"
  ) {
    className =
      "border border-red-200 bg-red-100 px-3 py-2 text-sm text-red-900 line-through";
  }

  if (
    changed &&
    type === "added"
  ) {
    className =
      "border border-green-200 bg-green-100 px-3 py-2 text-sm text-green-900";
  }

  return (
    <td className={className}>
      {String(value ?? "")}
    </td>
  );
}

function TablePreview({
  content,
  changedCells,
  type,
}: {
  content: TableContent;
  changedCells?: Set<string>;
  type?: "added" | "removed";
}) {
  const headers = content.headers ?? [];
  const rows = content.rows ?? [];

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full border-collapse">
        {headers.length > 0 && (
          <thead>
            <tr className="bg-slate-100">
              {headers.map(
                (header, index) => (
                  <th
                    key={index}
                    className="border border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase text-slate-600"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
        )}

        <tbody>
          {rows.map(
            (row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map(
                  (
                    cell,
                    columnIndex
                  ) => {
                    const key = `${rowIndex}:${columnIndex}`;

                    return (
                      <Cell
                        key={columnIndex}
                        value={cell}
                        changed={changedCells?.has(
                          key
                        )}
                        type={type}
                      />
                    );
                  }
                )}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

function createChangedCells(
  fromRows: string[][],
  toRows: string[][]
) {
  const oldChanged = new Set<string>();
  const newChanged = new Set<string>();

  const maxRows = Math.max(
    fromRows.length,
    toRows.length
  );

  for (
    let row = 0;
    row < maxRows;
    row++
  ) {
    const oldRow =
      fromRows[row] ?? [];

    const newRow =
      toRows[row] ?? [];

    const maxColumns = Math.max(
      oldRow.length,
      newRow.length
    );

    for (
      let column = 0;
      column < maxColumns;
      column++
    ) {
      const oldValue =
        oldRow[column];

      const newValue =
        newRow[column];

      if (
        normalize(oldValue) !==
        normalize(newValue)
      ) {
        if (
          oldValue !== undefined
        ) {
          oldChanged.add(
            `${row}:${column}`
          );
        }

        if (
          newValue !== undefined
        ) {
          newChanged.add(
            `${row}:${column}`
          );
        }
      }
    }
  }

  return {
    oldChanged,
    newChanged,
  };
}

export default function TableDiff({
  from,
  to,
}: Props) {
  const oldContent =
    getTableContent(
      from.content
    );

  const newContent = to
    ? getTableContent(to.content)
    : {};

  /*
   * Removed table
   */
  if (!to) {
    return (
      <div className="space-y-3">
        <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
          Removed
        </span>

        <TablePreview
          content={oldContent}
          type="removed"
        />
      </div>
    );
  }

  const oldHeaders =
    oldContent.headers ?? [];

  const newHeaders =
    newContent.headers ?? [];

  const headersChanged =
    JSON.stringify(oldHeaders) !==
    JSON.stringify(newHeaders);

  const {
    oldChanged,
    newChanged,
  } = createChangedCells(
    oldContent.rows ?? [],
    newContent.rows ?? []
  );

  const rowsChanged =
    oldChanged.size > 0 ||
    newChanged.size > 0;

  const oldRows =
    oldContent.rows ?? [];

  const newRows =
    newContent.rows ?? [];

  const dimensionsChanged =
    oldRows.length !==
      newRows.length ||
    oldRows.some(
      (row, index) =>
        row.length !==
        (newRows[index]?.length ?? 0)
    );

  const hasChanges =
    headersChanged ||
    rowsChanged ||
    dimensionsChanged;

  /*
   * Nothing changed
   */
  if (!hasChanges) {
    return (
      <TablePreview
        content={oldContent}
      />
    );
  }

  return (
    <div className="space-y-5">
      {headersChanged && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-blue-700">
            Headers changed
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-medium text-red-600">
                Previous
              </p>

              <div className="rounded bg-red-100 p-3 text-sm text-red-900">
                {oldHeaders.join(" | ")}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-green-600">
                New
              </p>

              <div className="rounded bg-green-100 p-3 text-sm text-green-900">
                {newHeaders.join(" | ")}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-red-600">
            Previous
          </p>

          <TablePreview
            content={oldContent}
            changedCells={oldChanged}
            type="removed"
          />
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-green-600">
            New
          </p>

          <TablePreview
            content={newContent}
            changedCells={newChanged}
            type="added"
          />
        </div>
      </div>
    </div>
  );
}