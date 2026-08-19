"use client";

import type {
  ReferenceBlockContent,
} from "@/types/article-editor";

type Props = {
  content: ReferenceBlockContent;
  onChange: (
    content: ReferenceBlockContent
  ) => void;
};

export default function ReferenceBlockEditor({
  content,
  onChange,
}: Props) {
  function update(
    updates: Partial<ReferenceBlockContent>
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
          Title
        </label>

        <input
          type="text"
          value={content.title}
          onChange={(event) =>
            update({
              title: event.target.value,
            })
          }
          placeholder="Reference title"
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
            update({
              url: event.target.value,
            })
          }
          placeholder="https://example.com"
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Publisher
          </label>

          <input
            type="text"
            value={content.publisher ?? ""}
            onChange={(event) =>
              update({
                publisher:
                  event.target.value,
              })
            }
            placeholder="Publisher"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
      </div>
    </div>
  );
}