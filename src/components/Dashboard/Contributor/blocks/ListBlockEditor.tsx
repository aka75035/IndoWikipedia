"use client";

import type {
  ListBlockContent,
} from "@/types/article-editor";

type Props = {
  content: ListBlockContent;
  onChange: (
    content: ListBlockContent
  ) => void;
};

export default function ListBlockEditor({
  content,
  onChange,
}: Props) {
  function updateItem(
    index: number,
    value: string
  ) {
    const items = [...content.items];

    items[index] = value;

    onChange({
      ...content,
      items,
    });
  }

  function addItem() {
    onChange({
      ...content,
      items: [...content.items, ""],
    });
  }

  function removeItem(index: number) {
    const items = content.items.filter(
      (_, i) => i !== index
    );

    onChange({
      ...content,
      items:
        items.length > 0
          ? items
          : [""],
    });
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-slate-700">
        List Items
      </label>

      {content.items.map(
        (item, index) => (
          <div
            key={index}
            className="flex gap-2"
          >
            <span className="pt-3 text-sm text-slate-500">
              •
            </span>

            <input
              type="text"
              value={item}
              onChange={(event) =>
                updateItem(
                  index,
                  event.target.value
                )
              }
              placeholder={`List item ${
                index + 1
              }`}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="button"
              onClick={() =>
                removeItem(index)
              }
              className="rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Remove
            </button>
          </div>
        )
      )}

      <button
        type="button"
        onClick={addItem}
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        + Add Item
      </button>
    </div>
  );
}