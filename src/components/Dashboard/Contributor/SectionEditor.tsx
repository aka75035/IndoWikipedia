"use client";

import BlockEditor from "./blocks/BlockEditor";

import type {
  ArticleEditorBlock,
  ArticleEditorSection,
} from "@/types/article-editor";

type Props = {
  section: ArticleEditorSection;
  onChange: (section: ArticleEditorSection) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

/**
 * Create a new block with the correct
 * content structure for its type.
 */
function createBlock(
  type: ArticleEditorBlock["type"],
  order: number
): ArticleEditorBlock {
  switch (type) {
    case "paragraph":
      return {
        type: "paragraph",
        content: "",
        order,
      };

    case "heading":
      return {
        type: "heading",
        content: "",
        order,
      };

    case "image":
      return {
        type: "image",
        content: {
          url: "",
          alt: "",
          caption: "",
        },
        order,
      };

    case "gallery":
      return {
        type: "gallery",
        content: {
          images: [],
        },
        order,
      };

    case "video":
      return {
        type: "video",
        content: {
          url: "",
          title: "",
          caption: "",
        },
        order,
      };

    case "quote":
      return {
        type: "quote",
        content: {
          text: "",
          author: "",
          source: "",
        },
        order,
      };

    case "list":
      return {
        type: "list",
        content: {
          items: [""],
        },
        order,
      };

    case "ordered-list":
      return {
        type: "ordered-list",
        content: {
          items: [""],
        },
        order,
      };

    case "table":
      return {
        type: "table",
        content: {
          headers: [""],
          rows: [[""]],
        },
        order,
      };

    case "code":
      return {
        type: "code",
        content: {
          code: "",
          language: "",
        },
        order,
      };

    case "math":
      return {
        type: "math",
        content: {
          expression: "",
        },
        order,
      };

    case "reference":
      return {
        type: "reference",
        content: {
          title: "",
          url: "",
          publisher: "",
          author: "",
        },
        order,
      };

    case "link":
      return {
        type: "link",
        content: {
          url: "",
          label: "",
        },
        order,
      };

    case "infobox":
      return {
        type: "infobox",
        content: {
          title: "",
          image: null,
          fields: [],
        },
        order,
      };
  }
}

export default function SectionEditor({
  section,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
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
    type: ArticleEditorBlock["type"]
  ) {
    const block = createBlock(
      type,
      section.blocks.length
    );

    updateSection({
      blocks: [
        ...section.blocks,
        block,
      ],
    });
  }

  function updateBlock(
    index: number,
    block: ArticleEditorBlock
  ) {
    const blocks = [...section.blocks];

    blocks[index] = block;

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

  function moveBlockUp(index: number) {
    if (index === 0) {
      return;
    }

    const blocks = [...section.blocks];

    [blocks[index - 1], blocks[index]] = [
      blocks[index],
      blocks[index - 1],
    ];

    updateSection({
      blocks: blocks.map((block, i) => ({
        ...block,
        order: i,
      })),
    });
  }

  function moveBlockDown(index: number) {
    if (
      index ===
      section.blocks.length - 1
    ) {
      return;
    }

    const blocks = [...section.blocks];

    [blocks[index], blocks[index + 1]] = [
      blocks[index + 1],
      blocks[index],
    ];

    updateSection({
      blocks: blocks.map((block, i) => ({
        ...block,
        order: i,
      })),
    });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Section Header */}
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
            placeholder="e.g. Early Life"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mt-7 flex items-center gap-2">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={section.order === 0}
            className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Move section up"
          >
            ↑
          </button>

          <button
            type="button"
            onClick={onMoveDown}
            className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Move section down"
          >
            ↓
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Section Level */}
      <div className="mt-4">
        <label className="text-sm font-medium text-slate-700">
          Heading Level
        </label>

        <select
          value={section.level}
          onChange={(event) =>
            updateSection({
              level: Number(
                event.target.value
              ),
            })
          }
          className="mt-2 rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
        >
          {[1, 2, 3, 4, 5, 6].map(
            (level) => (
              <option
                key={level}
                value={level}
              >
                H{level}
              </option>
            )
          )}
        </select>
      </div>

      {/* Blocks */}
      <div className="mt-6 space-y-4">
        {section.blocks.map(
          (block, index) => (
            <BlockEditor
              key={`${block.order}-${index}`}
              block={block}
              index={index}
              totalBlocks={
                section.blocks.length
              }
              onChange={(updatedBlock) =>
                updateBlock(
                  index,
                  updatedBlock
                )
              }
              onDelete={() =>
                deleteBlock(index)
              }
              onMoveUp={() =>
                moveBlockUp(index)
              }
              onMoveDown={() =>
                moveBlockDown(index)
              }
            />
          )
        )}
      </div>

      {/* Add Block */}
      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-slate-700">
          Add Block
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              addBlock("paragraph")
            }
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            + Paragraph
          </button>

          <button
            type="button"
            onClick={() =>
              addBlock("heading")
            }
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            + Heading
          </button>

          <button
            type="button"
            onClick={() =>
              addBlock("image")
            }
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            + Image
          </button>

          <button
            type="button"
            onClick={() =>
              addBlock("gallery")
            }
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            + Gallery
          </button>

          <button
            type="button"
            onClick={() =>
              addBlock("video")
            }
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            + Video
          </button>

          <button
            type="button"
            onClick={() =>
              addBlock("quote")
            }
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            + Quote
          </button>

          <button
            type="button"
            onClick={() =>
              addBlock("list")
            }
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            + List
          </button>

          <button
            type="button"
            onClick={() =>
              addBlock("ordered-list")
            }
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            + Ordered List
          </button>

          <button
            type="button"
            onClick={() =>
              addBlock("table")
            }
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            + Table
          </button>

          <button
            type="button"
            onClick={() =>
              addBlock("code")
            }
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            + Code
          </button>

          <button
            type="button"
            onClick={() =>
              addBlock("math")
            }
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            + Math
          </button>

          <button
            type="button"
            onClick={() =>
              addBlock("reference")
            }
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            + Reference
          </button>

          <button
            type="button"
            onClick={() =>
              addBlock("link")
            }
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            + Link
          </button>

          <button
            type="button"
            onClick={() =>
              addBlock("infobox")
            }
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            + Infobox
          </button>
        </div>
      </div>
    </div>
  );
}