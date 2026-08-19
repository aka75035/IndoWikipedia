"use client";

import type {
  VideoBlockContent,
} from "@/types/article-editor";

type Props = {
  content: VideoBlockContent;
  onChange: (
    content: VideoBlockContent
  ) => void;
};

export default function VideoBlockEditor({
  content,
  onChange,
}: Props) {
  function update(
    updates: Partial<VideoBlockContent>
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
          Video URL
        </label>

        <input
          type="url"
          value={content.url}
          onChange={(event) =>
            update({
              url: event.target.value,
            })
          }
          placeholder="https://example.com/video"
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">
          Title
        </label>

        <input
          type="text"
          value={content.title ?? ""}
          onChange={(event) =>
            update({
              title: event.target.value,
            })
          }
          placeholder="Video title"
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">
          Caption
        </label>

        <input
          type="text"
          value={content.caption ?? ""}
          onChange={(event) =>
            update({
              caption:
                event.target.value,
            })
          }
          placeholder="Video caption"
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>
    </div>
  );
}