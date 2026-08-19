"use client";

import type { ArticleEditorBlock } from "@/types/article-editor";

import ParagraphBlockEditor from "./ParagraphBlockEditor";
import HeadingBlockEditor from "./HeadingBlockEditor";
import ImageBlockEditor from "./ImageBlockEditor";
import GalleryBlockEditor from "./GalleryBlockEditor";
import VideoBlockEditor from "./VideoBlockEditor";
import QuoteBlockEditor from "./QuoteBlockEditor";
import ListBlockEditor from "./ListBlockEditor";
import OrderedListBlockEditor from "./OrderedListBlockEditor";
import TableBlockEditor from "./TableBlockEditor";
import CodeBlockEditor from "./CodeBlockEditor";
import MathBlockEditor from "./MathBlockEditor";
import ReferenceBlockEditor from "./ReferenceBlockEditor";
import LinkBlockEditor from "./LinkBlockEditor";
import InfoboxBlockEditor from "./InfoboxBlockEditor";

type Props = {
  block: ArticleEditorBlock;
  index: number;
  totalBlocks: number;

  onChange: (
    block: ArticleEditorBlock
  ) => void;

  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

export default function BlockEditor({
  block,
  index,
  totalBlocks,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: Props) {
  /**
   * Update only the content of the
   * current block while preserving
   * its type and order.
   */
  function updateContent(
    content: ArticleEditorBlock["content"]
  ) {
    onChange({
      ...block,
      content,
    } as ArticleEditorBlock);
  }

  /**
   * Render the correct editor based
   * on the discriminated block type.
   */
  function renderBlockEditor() {
    switch (block.type) {
      case "paragraph":
        return (
          <ParagraphBlockEditor
            content={block.content}
            onChange={updateContent}
          />
        );

      case "heading":
        return (
          <HeadingBlockEditor
            content={block.content}
            onChange={updateContent}
          />
        );

      case "image":
        return (
          <ImageBlockEditor
            content={block.content}
            onChange={updateContent}
          />
        );

      case "gallery":
        return (
          <GalleryBlockEditor
            content={block.content}
            onChange={updateContent}
          />
        );

      case "video":
        return (
          <VideoBlockEditor
            content={block.content}
            onChange={updateContent}
          />
        );

      case "quote":
        return (
          <QuoteBlockEditor
            content={block.content}
            onChange={updateContent}
          />
        );

      case "list":
        return (
          <ListBlockEditor
            content={block.content}
            onChange={updateContent}
          />
        );

      case "ordered-list":
        return (
          <OrderedListBlockEditor
            content={block.content}
            onChange={updateContent}
          />
        );

      case "table":
        return (
          <TableBlockEditor
            content={block.content}
            onChange={updateContent}
          />
        );

      case "code":
        return (
          <CodeBlockEditor
            content={block.content}
            onChange={updateContent}
          />
        );

      case "math":
        return (
          <MathBlockEditor
            content={block.content}
            onChange={updateContent}
          />
        );

      case "reference":
        return (
          <ReferenceBlockEditor
            content={block.content}
            onChange={updateContent}
          />
        );

      case "link":
        return (
          <LinkBlockEditor
            content={block.content}
            onChange={updateContent}
          />
        );

      case "infobox":
        return (
          <InfoboxBlockEditor
            content={block.content}
            onChange={updateContent}
          />
        );

      default:
        return null;
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      {/* Block Header */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium capitalize text-slate-700">
          {block.type}
        </span>

        <div className="flex items-center gap-3">
          {/* Move Up */}
          <button
            type="button"
            disabled={index === 0}
            onClick={onMoveUp}
            className="text-sm text-slate-600 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Move block up"
          >
            ↑
          </button>

          {/* Move Down */}
          <button
            type="button"
            disabled={
              index === totalBlocks - 1
            }
            onClick={onMoveDown}
            className="text-sm text-slate-600 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Move block down"
          >
            ↓
          </button>

          {/* Remove */}
          <button
            type="button"
            onClick={onDelete}
            className="text-sm text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Actual Block Editor */}
      {renderBlockEditor()}
    </div>
  );
}