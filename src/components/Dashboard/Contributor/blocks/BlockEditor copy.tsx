"use client";

import type {
  ArticleEditorBlock,
} from "@/types/article-editor";
import { ReactNode } from "react";

type Props = {
  block: ArticleEditorBlock;
  index: number;
  totalBlocks: number;

  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;

  children: ReactNode;
};

export default function BlockEditor({
  block,
  index,
  totalBlocks,
  onDelete,
  onMoveUp,
  onMoveDown,
  children,
}: Props) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      {/* Block header */}
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

          {/* Delete */}
          <button
            type="button"
            onClick={onDelete}
            className="text-sm text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Block editor */}
      {children}
    </div>
  );
}