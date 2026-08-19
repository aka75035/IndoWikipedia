"use client";

import type {
  MathBlockContent,
} from "@/types/article-editor";

type Props = {
  content: MathBlockContent;
  onChange: (
    content: MathBlockContent
  ) => void;
};

export default function MathBlockEditor({
  content,
  onChange,
}: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-700">
          Mathematical Expression
        </label>

        <textarea
          value={content.expression}
          onChange={(event) =>
            onChange({
              expression:
                event.target.value,
            })
          }
          rows={4}
          placeholder="E = mc^2"
          className="mt-2 w-full resize-y rounded-lg border border-slate-300 px-4 py-3 font-mono outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {content.expression && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            Expression
          </p>

          <code className="font-mono text-slate-800">
            {content.expression}
          </code>
        </div>
      )}
    </div>
  );
}