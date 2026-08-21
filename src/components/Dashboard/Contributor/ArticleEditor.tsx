"use client";

import { FormEvent, useState } from "react";
import SectionEditor from "./SectionEditor";
import type {
  ArticleEditorInfobox,
  ArticleEditorReference,
  ArticleEditorProps,
  ArticleEditorCategory,
  ArticleEditorSection,
} from "@/types/article-editor";
import Image from "next/image";



export default function ArticleEditor({
  slug,
  title: initialTitle,
  summary: initialSummary,
  categories: initialCategories,
  availableCategories,
  sections: initialSections,
  infobox: initialInfobox,
  references: initialReferences,
  editSummary: initialEditSummary,
}: ArticleEditorProps) {

  const [title, setTitle] = useState(initialTitle);
  const [summary, setSummary] = useState(initialSummary);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sections, setSections] = useState<ArticleEditorSection[]>(initialSections);
  const [references, setReferences] = useState<ArticleEditorReference[]>(initialReferences);
  const [infobox, setInfobox] = useState<ArticleEditorInfobox | null>(initialInfobox);
  const [editSummary, setEditSummary] = useState(initialEditSummary);
  const [categories, setCategories] = useState<ArticleEditorCategory[]>(initialCategories);

  function addReference() {
    setReferences((current) => [
      ...current,
      {
        title: "",
        url: "",
        publisher: "",
        author: "",
        publishedAt: "",
        accessedAt: "",
        description: "",
      },
    ]);
  }

  function updateReference(
    index: number,
    updates: Partial<ArticleEditorReference>
  ) {
    setReferences((current) => {
      const updated = [...current];

      updated[index] = {
        ...updated[index],
        ...updates,
      };

      return updated;
    });
  }

  function deleteReference(index: number) {
    setReferences((current) =>
      current.filter((_, i) => i !== index)
    );
  }

  function createEmptyInfobox() {
  setInfobox({
    title: "",
    image: null,
    fields: [],
  });
  }

  function updateInfobox(
    updates: Partial<ArticleEditorInfobox>
  ) {
    setInfobox((current) => {
      if (!current) return current;

      return {
        ...current,
        ...updates,
      };
    });
  }

  function addInfoboxField() {
    setInfobox((current) => {
      if (!current) return current;

      return {
        ...current,
        fields: [
          ...current.fields,
          {
            label: "",
            value: "",
            order: current.fields.length,
          },
        ],
      };
    });
  }

  function updateInfoboxField(
    index: number,
    updates: Partial<
      ArticleEditorInfobox["fields"][number]
    >
  ) {
    setInfobox((current) => {
      if (!current) return current;

      const fields = [...current.fields];

      fields[index] = {
        ...fields[index],
        ...updates,
      };

      return {
        ...current,
        fields,
      };
    });
  }

  function deleteInfoboxField(
    index: number
  ) {
    setInfobox((current) => {
      if (!current) return current;

      return {
        ...current,
        fields: current.fields
          .filter((_, i) => i !== index)
          .map((field, i) => ({
            ...field,
            order: i,
          })),
      };
    });
  }

  function removeInfobox() {
    setInfobox(null);
  }

  function addCategory(
    category: ArticleEditorCategory
  ) {
    setCategories((current) => {
      if (
        current.some(
          (item) => item._id === category._id
        )
      ) {
        return current;
      }

      return [...current, category];
    });
  }

  function removeCategory(
    categoryId: string
  ) {
    setCategories((current) =>
      current.filter(
        (category) =>
          category._id !== categoryId
      )
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/articles/${slug}/revisions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            summary,
            categories: categories.map(
              (category) =>category._id
            ),
            sections,
            references,
            infobox,
            editSummary,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save revision"
        );
      }

      console.log("Revision created:", data);

      setMessage(
        "Changes saved successfully."
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save changes."
      );
    } finally {
      setLoading(false);
    }
  }
  function addSection() {
    setSections((current) => [
      ...current,
      {
        title: "",
        level: 2,
        blocks: [],
        order: current.length,
      },
    ]);
  }
  function updateSection(
    index: number,
    section: ArticleEditorSection
  ) {
    setSections((current) => {
      const updated = [...current];

      updated[index] = section;

      return updated;
    });
  }

  function moveSectionUp(index: number) {
    if (index === 0) return;

    setSections((current) => {
      const updated = [...current];

      [updated[index - 1], updated[index]] = [
        updated[index],
        updated[index - 1],
      ];

      return updated.map((section, i) => ({
        ...section,
        order: i,
      }));
    });
  }

  function moveSectionDown(index: number) {
    if (index === sections.length - 1) {
      return;
    }

    setSections((current) => {
      const updated = [...current];

      [updated[index], updated[index + 1]] = [
        updated[index + 1],
        updated[index],
      ];

      return updated.map((section, i) => ({
        ...section,
        order: i,
      }));
    });
  }
  
  function deleteSection(index: number) {
    setSections((current) =>
      current
        .filter((_, i) => i !== index)
        .map((section, i) => ({
          ...section,
          order: i,
        }))
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 space-y-6"
    >
      {/* Revision title */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <label
          htmlFor="revision-title"
          className="block text-sm font-medium text-slate-700"
        >
          Revision Title
        </label>

        <input
          id="revision-title"
          type="text"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          maxLength={300}
          required
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <label
          htmlFor="summary"
          className="block text-sm font-medium text-slate-700"
        >
          Summary
        </label>

        <textarea
          id="summary"
          value={summary}
          onChange={(event) =>
            setSummary(event.target.value)
          }
          maxLength={1000}
          rows={5}
          placeholder="Briefly describe the article..."
          className="mt-2 w-full resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <p className="mt-2 text-xs text-slate-500">
          {summary.length}/1000 characters
        </p>
      </div>

      {/* Categories */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Categories
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Assign categories to this article.
          </p>
        </div>

        {/* Selected categories */}
        <div className="mt-4">
          {categories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm text-blue-700"
                >
                  <span>{category.name}</span>

                  <button
                    type="button"
                    onClick={() =>
                      removeCategory(category._id)
                    }
                    className="font-medium text-blue-500 hover:text-red-600"
                    aria-label={`Remove ${category.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No categories assigned.
            </p>
          )}
        </div>

        {/* Add category */}
        <div className="mt-5">
          <label
            htmlFor="category-select"
            className="text-sm font-medium text-slate-700"
          >
            Add Category
          </label>

          <select
            id="category-select"
            value=""
            onChange={(event) => {
              const category =
                availableCategories.find(
                  (item) =>
                    item._id === event.target.value
                );

              if (category) {
                addCategory(category);
              }
            }}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">
              Select a category
            </option>

            {availableCategories
              .filter(
                (category) =>
                  !categories.some(
                    (selected) =>
                      selected._id === category._id
                  )
              )
              .map((category) => (
                <option
                  key={category._id}
                  value={category._id}
                >
                  {category.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Sections
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Build the structure of your article.
            </p>
          </div>

          <button
            type="button"
            onClick={addSection}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Add Section
          </button>
        </div>

        <div className="mt-6 space-y-5">
          {sections.map((section, index) => (
            <SectionEditor
              key={index}
              section={section}
              onChange={(updated) =>
                updateSection(index, updated)
              }
              onDelete={() =>
                deleteSection(index)
              }
              onMoveUp={() =>
                moveSectionUp(index)
              }
              onMoveDown={() =>
                moveSectionDown(index)
              }
            />
          ))}
        </div>
      </div>

      {/* References */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              References
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add sources used to create this article.
            </p>
          </div>

          <button
            type="button"
            onClick={addReference}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Add Reference
          </button>
        </div>

        <div className="mt-6 space-y-5">
          {references.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
              No references added yet.
            </div>
          )}

          {references.map((reference, index) => (
            <div
              key={reference._id ?? index}
              className="rounded-lg border border-slate-200 bg-slate-50 p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-medium text-slate-800">
                  Reference {index + 1}
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    deleteReference(index)
                  }
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Title
                  </label>

                  <input
                    type="text"
                    value={reference.title}
                    onChange={(event) =>
                      updateReference(index, {
                        title: event.target.value,
                      })
                    }
                    placeholder="Source title"
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    URL
                  </label>

                  <input
                    type="url"
                    value={reference.url}
                    onChange={(event) =>
                      updateReference(index, {
                        url: event.target.value,
                      })
                    }
                    placeholder="https://example.com/source"
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Publisher
                    </label>

                    <input
                      type="text"
                      value={
                        reference.publisher ?? ""
                      }
                      onChange={(event) =>
                        updateReference(index, {
                          publisher:
                            event.target.value,
                        })
                      }
                      placeholder="Publisher"
                      className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Author
                    </label>

                    <input
                      type="text"
                      value={reference.author ?? ""}
                      onChange={(event) =>
                        updateReference(index, {
                          author:
                            event.target.value,
                        })
                      }
                      placeholder="Author"
                      className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Published At
                    </label>

                    <input
                      type="datetime-local"
                      value={
                        reference.publishedAt
                          ? new Date(
                              reference.publishedAt
                            )
                              .toISOString()
                              .slice(0, 16)
                          : ""
                      }
                      onChange={(event) =>
                        updateReference(index, {
                          publishedAt:
                            event.target.value
                              ? new Date(
                                  event.target.value
                                ).toISOString()
                              : undefined,
                        })
                      }
                      className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Accessed At
                    </label>

                    <input
                      type="datetime-local"
                      value={
                        reference.accessedAt
                          ? new Date(
                              reference.accessedAt
                            )
                              .toISOString()
                              .slice(0, 16)
                          : ""
                      }
                      onChange={(event) =>
                        updateReference(index, {
                          accessedAt:
                            event.target.value
                              ? new Date(
                                  event.target.value
                                ).toISOString()
                              : undefined,
                        })
                      }
                      className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Description
                  </label>

                  <textarea
                    value={
                      reference.description ?? ""
                    }
                    onChange={(event) =>
                      updateReference(index, {
                        description:
                          event.target.value,
                      })
                    }
                    rows={3}
                    placeholder="Brief description of the source..."
                    className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Infobox */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Article Infobox
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add structured information about the article.
            </p>
          </div>

          {!infobox ? (
            <button
              type="button"
              onClick={createEmptyInfobox}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              + Add Infobox
            </button>
          ) : (
            <button
              type="button"
              onClick={removeInfobox}
              className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Remove Infobox
            </button>
          )}
        </div>

        {!infobox && (
          <div className="mt-5 rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
            No infobox added.
          </div>
        )}

        {infobox && (
          <div className="mt-6 space-y-5">
            {/* Title */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Infobox Title
              </label>

              <input
                type="text"
                value={infobox.title}
                onChange={(event) =>
                  updateInfobox({
                    title: event.target.value,
                  })
                }
                placeholder="e.g. Ashoka"
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Image */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Image URL
              </label>

              <input
                type="url"
                value={infobox.image ?? ""}
                onChange={(event) =>
                  updateInfobox({
                    image:
                      event.target.value || null,
                  })
                }
                placeholder="https://example.com/image.jpg"
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              {infobox.image && (
                <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
                  <Image
                    src={infobox.image}
                    alt={infobox.title ?? ""}
                    width={800}
                    height={450}
                    className="mx-auto max-h-72 object-contain"
                  />
                </div>
              )}
            </div>

            {/* Fields */}
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-slate-700">
                    Fields
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Add key-value information about the article.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addInfoboxField}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  + Add Field
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {infobox.fields.length === 0 && (
                  <div className="rounded-lg border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">
                    No fields added yet.
                  </div>
                )}

                {infobox.fields.map(
                  (field, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">
                          Field {index + 1}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            deleteInfoboxField(index)
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
                              updateInfoboxField(
                                index,
                                {
                                  label:
                                    event.target
                                      .value,
                                }
                              )
                            }
                            placeholder="Born"
                            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                              updateInfoboxField(
                                index,
                                {
                                  value:
                                    event.target
                                      .value,
                                }
                              )
                            }
                            placeholder="304 BC"
                            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Preview */}
            {(infobox.title ||
              infobox.image ||
              infobox.fields.length > 0) && (
              <div className="overflow-hidden rounded-lg border border-slate-300 bg-white">
                {infobox.title && (
                  <div className="bg-slate-100 px-4 py-3 text-center">
                    <h3 className="font-semibold text-slate-800">
                      {infobox.title}
                    </h3>
                  </div>
                )}

                {infobox.image && (
                  <div className="border-b border-slate-200 p-4">
                    <Image
                      src={infobox.image}
                      alt={infobox.title ?? ""}
                      width={800}
                      height={450}
                      className="mx-auto max-h-64 object-contain"
                    />
                  </div>
                )}

                {infobox.fields.length > 0 && (
                  <div>
                    {infobox.fields.map(
                      (field, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-2 border-b border-slate-200 last:border-b-0"
                        >
                          <div className="bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
                            {field.label}
                          </div>

                          <div className="px-4 py-2 text-sm text-slate-700">
                            {field.value}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Summary */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <label
          htmlFor="edit-summary"
          className="block text-sm font-medium text-slate-700"
        >
          Edit Summary
        </label>

        <textarea
          id="edit-summary"
          value={editSummary}
          onChange={(event) =>
            setEditSummary(event.target.value)
          }
          maxLength={500}
          rows={3}
          placeholder="Briefly describe what you changed..."
          className="mt-2 w-full resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <p className="mt-2 text-xs text-slate-500">
          {editSummary.length}/500 characters
        </p>
      </div>
      

      {/* Message */}
      {message && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          {message}
        </div>
      )}

      {/* Save */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : "Save Changes"}
        </button>
      </div>
    </form>
  );
}