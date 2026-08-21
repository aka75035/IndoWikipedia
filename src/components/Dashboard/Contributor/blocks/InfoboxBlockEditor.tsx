"use client";

import type {
  InfoboxBlockContent,
} from "@/types/article-editor";
import Image from "next/image";

type Props = {
  content: InfoboxBlockContent;
  onChange: (
    content: InfoboxBlockContent
  ) => void;
};

export default function InfoboxBlockEditor({
  content,
  onChange,
}: Props) {
  function update(
    updates: Partial<InfoboxBlockContent>
  ) {
    onChange({
      ...content,
      ...updates,
    });
  }

  function addField() {
    onChange({
      ...content,
      fields: [
        ...content.fields,
        {
          label: "",
          value: "",
          order: content.fields.length,
        },
      ],
    });
  }

  function updateField(
    index: number,
    updates: Partial<
      InfoboxBlockContent["fields"][number]
    >
  ) {
    const fields = [...content.fields];

    fields[index] = {
      ...fields[index],
      ...updates,
    };

    onChange({
      ...content,
      fields,
    });
  }

  function removeField(index: number) {
    onChange({
      ...content,
      fields: content.fields
        .filter(
          (_, i) => i !== index
        )
        .map((field, i) => ({
          ...field,
          order: i,
        })),
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-medium text-slate-700">
          Infobox Title
        </label>

        <input
          type="text"
          value={content.title}
          onChange={(event) =>
            update({
              title: event.target.value,
            })
          }
          placeholder="Infobox title"
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">
          Image URL
        </label>

        <input
          type="url"
          value={content.image ?? ""}
          onChange={(event) =>
            update({
              image:
                event.target.value ||
                null,
            })
          }
          placeholder="https://example.com/image.jpg"
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">
            Fields
          </label>

          <button
            type="button"
            onClick={addField}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            + Add Field
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {content.fields.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-5 text-center text-sm text-slate-500">
              No fields added yet.
            </div>
          )}

          {content.fields.map(
            (field, index) => (
              <div
                key={index}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    Field {index + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      removeField(index)
                    }
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-slate-500">
                      Label
                    </label>

                    <input
                      type="text"
                      value={field.label}
                      onChange={(event) =>
                        updateField(
                          index,
                          {
                            label:
                              event.target
                                .value,
                          }
                        )
                      }
                      placeholder="Born"
                      className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-500">
                      Value
                    </label>

                    <input
                      type="text"
                      value={field.value}
                      onChange={(event) =>
                        updateField(
                          index,
                          {
                            value:
                              event.target
                                .value,
                          }
                        )
                      }
                      placeholder="304 BC"
                      className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {(content.title ||
        content.image ||
        content.fields.length > 0) && (
        <div className="overflow-hidden rounded-lg border border-slate-300 bg-white">
          {content.title && (
            <div className="bg-slate-100 px-4 py-3 text-center">
              <h3 className="font-semibold text-slate-800">
                {content.title}
              </h3>
            </div>
          )}

          {content.image && (
            <div className="border-b border-slate-200 p-4">
              <Image
                src={content.image}
                alt={content.title ?? ""}
                width={800}
                height={450}
                className="mx-auto max-h-64 object-contain"
              />
            </div>
          )}

          {content.fields.length > 0 && (
            <div>
              {content.fields.map(
                (field, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 border-b border-slate-200 last:border-b-0"
                  >
                    <div className="bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
                      {field.label}
                    </div>

                    <div className="px-4 py-2 text-sm text-slate-700">
                      {String(
                        field.value
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}