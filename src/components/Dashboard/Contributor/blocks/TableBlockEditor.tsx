"use client";

import type {
  TableBlockContent,
} from "@/types/article-editor";

type Props = {
  content: TableBlockContent;
  onChange: (
    content: TableBlockContent
  ) => void;
};

export default function TableBlockEditor({
  content,
  onChange,
}: Props) {
  function updateHeader(
    index: number,
    value: string
  ) {
    const headers = [...content.headers];

    headers[index] = value;

    onChange({
      ...content,
      headers,
    });
  }

  function addColumn() {
    onChange({
      ...content,
      headers: [
        ...content.headers,
        "",
      ],
      rows: content.rows.map(
        (row) => [...row, ""]
      ),
    });
  }

  function removeColumn(index: number) {
    if (content.headers.length === 1) {
      return;
    }

    onChange({
      ...content,
      headers: content.headers.filter(
        (_, i) => i !== index
      ),
      rows: content.rows.map((row) =>
        row.filter((_, i) => i !== index)
      ),
    });
  }

  function updateCell(
    rowIndex: number,
    columnIndex: number,
    value: string
  ) {
    const rows = content.rows.map(
      (row) => [...row]
    );

    rows[rowIndex][columnIndex] =
      value;

    onChange({
      ...content,
      rows,
    });
  }

  function addRow() {
    onChange({
      ...content,
      rows: [
        ...content.rows,
        content.headers.map(() => ""),
      ],
    });
  }

  function removeRow(index: number) {
    if (content.rows.length === 1) {
      return;
    }

    onChange({
      ...content,
      rows: content.rows.filter(
        (_, i) => i !== index
      ),
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-medium text-slate-700">
          Table Headers
        </h3>

        <div className="mt-3 space-y-2">
          {content.headers.map(
            (header, index) => (
              <div
                key={index}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={header}
                  onChange={(event) =>
                    updateHeader(
                      index,
                      event.target.value
                    )
                  }
                  placeholder={`Header ${
                    index + 1
                  }`}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                />

                <button
                  type="button"
                  disabled={
                    content.headers.length ===
                    1
                  }
                  onClick={() =>
                    removeColumn(index)
                  }
                  className="text-sm text-red-600 disabled:opacity-30"
                >
                  Remove
                </button>
              </div>
            )
          )}
        </div>

        <button
          type="button"
          onClick={addColumn}
          className="mt-3 rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
        >
          + Add Column
        </button>
      </div>

      <div>
        <h3 className="text-sm font-medium text-slate-700">
          Table Rows
        </h3>

        <div className="mt-3 space-y-3">
          {content.rows.map(
            (row, rowIndex) => (
              <div
                key={rowIndex}
                className="rounded-lg border border-slate-200 bg-white p-3"
              >
                <div className="space-y-2">
                  {content.headers.map(
                    (_, columnIndex) => (
                      <input
                        key={columnIndex}
                        type="text"
                        value={
                          row[columnIndex] ??
                          ""
                        }
                        onChange={(event) =>
                          updateCell(
                            rowIndex,
                            columnIndex,
                            event.target
                              .value
                          )
                        }
                        placeholder={`Column ${
                          columnIndex + 1
                        }`}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                      />
                    )
                  )}
                </div>

                <button
                  type="button"
                  disabled={
                    content.rows.length ===
                    1
                  }
                  onClick={() =>
                    removeRow(rowIndex)
                  }
                  className="mt-3 text-sm text-red-600 disabled:opacity-30"
                >
                  Remove Row
                </button>
              </div>
            )
          )}
        </div>

        <button
          type="button"
          onClick={addRow}
          className="mt-3 rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
        >
          + Add Row
        </button>
      </div>
    </div>
  );
}