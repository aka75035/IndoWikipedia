"use client";

import type {
  GalleryBlockContent,
} from "@/types/article-editor";
import Image from "next/image";

type Props = {
  content: GalleryBlockContent;
  onChange: (
    content: GalleryBlockContent
  ) => void;
};

export default function GalleryBlockEditor({
  content,
  onChange,
}: Props) {
  function addImage() {
    onChange({
      ...content,
      images: [
        ...content.images,
        {
          url: "",
          alt: "",
          caption: "",
        },
      ],
    });
  }

  function updateImage(
    index: number,
    updates: Partial<
      GalleryBlockContent["images"][number]
    >
  ) {
    const images = [...content.images];

    images[index] = {
      ...images[index],
      ...updates,
    };

    onChange({
      ...content,
      images,
    });
  }

  function deleteImage(index: number) {
    onChange({
      ...content,
      images: content.images.filter(
        (_, i) => i !== index
      ),
    });
  }

  return (
    <div className="space-y-4">
      {content.images.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
          No images added yet.
        </div>
      )}

      {content.images.map(
        (image, index) => (
          <div
            key={index}
            className="rounded-lg border border-slate-200 bg-white p-4"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">
                Image {index + 1}
              </span>

              <button
                type="button"
                onClick={() =>
                  deleteImage(index)
                }
                className="text-sm text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="url"
                value={image.url}
                onChange={(event) =>
                  updateImage(index, {
                    url: event.target.value,
                  })
                }
                placeholder="Image URL"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <input
                type="text"
                value={image.alt}
                onChange={(event) =>
                  updateImage(index, {
                    alt: event.target.value,
                  })
                }
                placeholder="Alt text"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <input
                type="text"
                value={image.caption ?? ""}
                onChange={(event) =>
                  updateImage(index, {
                    caption:
                      event.target.value,
                  })
                }
                placeholder="Caption"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              {image.url && (
                <Image
                  src={image.url}
                  alt={image.alt}
                  width={800}
                  height={450}
                  className="mx-auto max-h-64 rounded-lg object-contain"
                />
              )}
            </div>
          </div>
        )
      )}

      <button
        type="button"
        onClick={addImage}
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        + Add Image
      </button>
    </div>
  );
}