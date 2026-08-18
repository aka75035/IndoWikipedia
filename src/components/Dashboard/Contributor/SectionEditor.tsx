"use client";

import type { ArticleEditorSection } from "@/types/article-editor";

type Props = {
  section: ArticleEditorSection;
  onChange: (section: ArticleEditorSection) => void;
  onDelete: () => void;
};

export default function SectionEditor({
  section,
  onChange,
  onDelete,
}: Props) {
  function updateSection(
    updates: Partial<ArticleEditorSection>
  ) {
    onChange({
      ...section,
      ...updates,
    });
  }

  function addBlock(
    type: "paragraph" | "heading"
  ) {
    const block = {
      type,
      content: "",
      order: section.blocks.length,
    };

    updateSection({
      blocks: [
        ...section.blocks,
        block,
      ],
    });
  }

  function updateBlock(
    index: number,
    content: unknown
  ) {
    const blocks = [...section.blocks];

    blocks[index] = {
      ...blocks[index],
      content,
    };

    updateSection({
      blocks,
    });
  }

  function deleteBlock(index: number) {
    const blocks = section.blocks
      .filter((_, i) => i !== index)
      .map((block, i) => ({
        ...block,
        order: i,
      }));

    updateSection({
      blocks,
    });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Section header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium text-slate-700">
            Section Title
          </label>

          <input
            type="text"
            value={section.title}
            onChange={(event) =>
              updateSection({
                title: event.target.value,
              })
            }
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="e.g. Early Life"
          />
        </div>

        <button
          type="button"
          onClick={onDelete}
          className="mt-7 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>

      {/* Section level */}
      <div className="mt-4">
        <label className="text-sm font-medium text-slate-700">
          Heading Level
        </label>

        <select
          value={section.level}
          onChange={(event) =>
            updateSection({
              level: Number(event.target.value),
            })
          }
          className="mt-2 rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
        >
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <option
              key={level}
              value={level}
            >
              H{level}
            </option>
          ))}
        </select>
      </div>

      {/* Blocks */}
      <div className="mt-6 space-y-4">
        {section.blocks.map((block, index) => (
          <div
            key={`${block.order}-${index}`}
            className="rounded-lg border border-slate-200 bg-slate-50 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium capitalize text-slate-700">
                {block.type}
              </span>

              <button
                type="button"
                onClick={() => deleteBlock(index)}
                className="text-sm text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>

            {block.type === "paragraph" && (
              <textarea
                value={
                  typeof block.content === "string"
                    ? block.content
                    : ""
                }
                onChange={(event) =>
                  updateBlock(
                    index,
                    event.target.value
                  )
                }
                rows={6}
                placeholder="Write paragraph content..."
                className="w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            )}

            {block.type === "heading" && (
              <input
                type="text"
                value={
                  typeof block.content === "string"
                    ? block.content
                    : ""
                }
                onChange={(event) =>
                  updateBlock(
                    index,
                    event.target.value
                  )
                }
                placeholder="Heading text..."
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            )}
          </div>
        ))}
      </div>

      {/* Add block */}
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => addBlock("paragraph")}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          + Paragraph
        </button>

        <button
          type="button"
          onClick={() => addBlock("heading")}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          + Heading
        </button>
      </div>
    </div>
  );
}