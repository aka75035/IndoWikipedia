"use client";

import type {
  QuoteBlockContent,
} from "@/types/article-editor";

type Props = {
  content: QuoteBlockContent;
  onChange: (
    content: QuoteBlockContent
  ) => void;
};

export default function QuoteBlockEditor({
  content,
  onChange,
}: Props) {
  function update(
    updates: Partial<QuoteBlockContent>
  ) {
    onChange({
      ...content,
      ...updates,
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-700">
          Quote
        </label>

        <textarea
          value={content.text}
          onChange={(event) =>
            update({
              text: event.target.value,
            })
          }
          rows={5}
          placeholder="Enter quotation..."
          className="mt-2 w-full resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">
          Author
        </label>

        <input
          type="text"
          value={content.author ?? ""}
          onChange={(event) =>
            update({
              author:
                event.target.value,
            })
          }
          placeholder="Author"
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">
          Source
        </label>

        <input
          type="text"
          value={content.source ?? ""}
          onChange={(event) =>
            update({
              source:
                event.target.value,
            })
          }
          placeholder="Source"
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {content.text && (
        <blockquote className="rounded-lg border-l-4 border-slate-400 bg-slate-100 p-4">
          <p className="text-base italic text-slate-700">
            “{content.text}”
          </p>

          {(content.author ||
            content.source) && (
            <footer className="mt-3 text-sm text-slate-500">
              {content.author &&
                `— ${content.author}`}

              {content.source &&
                `, ${content.source}`}
            </footer>
          )}
        </blockquote>
      )}
    </div>
  );
}