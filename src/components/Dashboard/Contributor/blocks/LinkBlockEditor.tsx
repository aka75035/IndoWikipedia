"use client";

import type {
  LinkBlockContent,
} from "@/types/article-editor";

type Props = {
  content: LinkBlockContent;
  onChange: (
    content: LinkBlockContent
  ) => void;
};

export default function LinkBlockEditor({
  content,
  onChange,
}: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-700">
          Label
        </label>

        <input
          type="text"
          value={content.label}
          onChange={(event) =>
            onChange({
              ...content,
              label: event.target.value,
            })
          }
          placeholder="Link text"
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">
          URL
        </label>

        <input
          type="url"
          value={content.url}
          onChange={(event) =>
            onChange({
              ...content,
              url: event.target.value,
            })
          }
          placeholder="https://example.com"
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {content.url &&
        content.label && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <a
              href={content.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {content.label}
            </a>
          </div>
        )}
    </div>
  );
}