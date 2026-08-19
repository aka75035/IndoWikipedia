"use client";

import type {
  ImageBlockContent,
} from "@/types/article-editor";

type Props = {
  content: ImageBlockContent;
  onChange: (
    content: ImageBlockContent
  ) => void;
};

export default function ImageBlockEditor({
  content,
  onChange,
}: Props) {
  function update(
    updates: Partial<ImageBlockContent>
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
          Image URL
        </label>

        <input
          type="url"
          value={content.url}
          onChange={(event) =>
            update({
              url: event.target.value,
            })
          }
          placeholder="https://example.com/image.jpg"
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">
          Alt Text
        </label>

        <input
          type="text"
          value={content.alt}
          onChange={(event) =>
            update({
              alt: event.target.value,
            })
          }
          placeholder="Describe the image..."
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
              caption: event.target.value,
            })
          }
          placeholder="Image caption..."
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {content.url && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-4">
          <img
            src={content.url}
            alt={content.alt}
            className="mx-auto max-h-72 object-contain"
          />

          {content.caption && (
            <p className="mt-3 text-center text-sm text-slate-500">
              {content.caption}
            </p>
          )}
        </div>
      )}
    </div>
  );
}