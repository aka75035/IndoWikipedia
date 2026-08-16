"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type InfoboxField = {
  label: string;
  value: string;
};

type Section = {
  heading: string;
  content: string;
  order: number;
};

type Reference = {
  title: string;
  url: string;
  publisher: string;
  accessedAt: string;
};

type ArticleForm = {
  title: string;
  slug: string;
  shortDescription: string;
  lead: string;

  infobox: {
    image: string;
    caption: string;
    fields: InfoboxField[];
  };

  sections: Section[];

  references: Reference[];

  categories: string[];

  relatedArticles: string[];

  featured: boolean;

  status: "draft" | "published";
};

const initialForm: ArticleForm = {
  title: "",
  slug: "",
  shortDescription: "",
  lead: "",

  infobox: {
    image: "",
    caption: "",
    fields: [],
  },

  sections: [
    {
      heading: "",
      content: "",
      order: 0,
    },
  ],

  references: [],

  categories: [],

  relatedArticles: [],

  featured: false,

  status: "draft",
};

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function AddArticleForm() {
  const router = useRouter();

  const [form, setForm] =
    useState<ArticleForm>(initialForm);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // --------------------------------
  // Basic fields
  // --------------------------------

  function handleBasicChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;

    setError("");

    setForm((prev) => {
      if (name === "title") {
        return {
          ...prev,
          title: value,
          slug: generateSlug(value),
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  }

  // --------------------------------
  // Infobox
  // --------------------------------

  function handleInfoboxChange(
    field: "image" | "caption",
    value: string
  ) {
    setForm((prev) => ({
      ...prev,

      infobox: {
        ...prev.infobox,
        [field]: value,
      },
    }));
  }

  function addInfoboxField() {
    setForm((prev) => ({
      ...prev,

      infobox: {
        ...prev.infobox,

        fields: [
          ...prev.infobox.fields,
          {
            label: "",
            value: "",
          },
        ],
      },
    }));
  }

  function updateInfoboxField(
    index: number,
    field: keyof InfoboxField,
    value: string
  ) {
    setForm((prev) => {
      const fields = [...prev.infobox.fields];

      fields[index] = {
        ...fields[index],
        [field]: value,
      };

      return {
        ...prev,

        infobox: {
          ...prev.infobox,
          fields,
        },
      };
    });
  }

  function removeInfoboxField(
    index: number
  ) {
    setForm((prev) => ({
      ...prev,

      infobox: {
        ...prev.infobox,

        fields: prev.infobox.fields.filter(
          (_, fieldIndex) =>
            fieldIndex !== index
        ),
      },
    }));
  }

  // --------------------------------
  // Sections
  // --------------------------------

  function addSection() {
    setForm((prev) => ({
      ...prev,

      sections: [
        ...prev.sections,
        {
          heading: "",
          content: "",
          order: prev.sections.length,
        },
      ],
    }));
  }

  function updateSection(
    index: number,
    field: "heading" | "content",
    value: string
  ) {
    setForm((prev) => {
      const sections = [...prev.sections];

      sections[index] = {
        ...sections[index],
        [field]: value,
      };

      return {
        ...prev,
        sections,
      };
    });
  }

  function removeSection(index: number) {
    setForm((prev) => ({
      ...prev,

      sections: prev.sections
        .filter(
          (_, sectionIndex) =>
            sectionIndex !== index
        )
        .map((section, sectionIndex) => ({
          ...section,
          order: sectionIndex,
        })),
    }));
  }

  // --------------------------------
  // References
  // --------------------------------

  function addReference() {
    setForm((prev) => ({
      ...prev,

      references: [
        ...prev.references,
        {
          title: "",
          url: "",
          publisher: "",
          accessedAt: "",
        },
      ],
    }));
  }

  function updateReference(
    index: number,
    field: keyof Reference,
    value: string
  ) {
    setForm((prev) => {
      const references = [...prev.references];

      references[index] = {
        ...references[index],
        [field]: value,
      };

      return {
        ...prev,
        references,
      };
    });
  }

  function removeReference(index: number) {
    setForm((prev) => ({
      ...prev,

      references: prev.references.filter(
        (_, referenceIndex) =>
          referenceIndex !== index
      ),
    }));
  }

  // --------------------------------
  // Categories
  // --------------------------------

  function handleCategoriesChange(
    value: string
  ) {
    const categories = value
      .split(",")
      .map((category) => category.trim())
      .filter(Boolean);

    setForm((prev) => ({
      ...prev,
      categories,
    }));
  }

  // --------------------------------
  // Submit
  // --------------------------------

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const cleanedSections =
        form.sections
          .filter(
            (section) =>
              section.heading.trim() ||
              section.content.trim()
          )
          .map((section, index) => ({
            ...section,
            order: index,
          }));

      const cleanedInfoboxFields =
        form.infobox.fields.filter(
          (field) =>
            field.label.trim() &&
            field.value.trim()
        );

      const payload = {
        ...form,

        infobox: {
          ...form.infobox,
          fields: cleanedInfoboxFields,
        },

        sections: cleanedSections,

        references: form.references.filter(
          (reference) =>
            reference.title.trim() &&
            reference.url.trim()
        ),
      };

      const res = await fetch(
        "/api/articles",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.message ||
            "Failed to create article"
        );

        return;
      }

      router.push("/admin/articles");

      router.refresh();
    } catch {
      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* ================================
          BASIC INFORMATION
      ================================= */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Basic Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Basic information about the article.
          </p>
        </div>

        <div className="space-y-5">
          {/* Title */}

          <div>
            <label
              htmlFor="title"
              className="font-medium text-slate-800"
            >
              Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleBasicChange}
              placeholder="Taj Mahal"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
              disabled={loading}
            />
          </div>

          {/* Slug */}

          <div>
            <label
              htmlFor="slug"
              className="font-medium text-slate-800"
            >
              Slug
            </label>

            <input
              id="slug"
              name="slug"
              type="text"
              value={form.slug}
              onChange={handleBasicChange}
              placeholder="taj-mahal"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
              disabled={loading}
            />

            <p className="mt-1 text-sm text-slate-500">
              Generated automatically from the
              title.
            </p>
          </div>

          {/* Short Description */}

          <div>
            <label
              htmlFor="shortDescription"
              className="font-medium text-slate-800"
            >
              Short Description
            </label>

            <textarea
              id="shortDescription"
              name="shortDescription"
              rows={3}
              value={form.shortDescription}
              onChange={handleBasicChange}
              placeholder="A white marble mausoleum located in Agra, India."
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              disabled={loading}
            />
          </div>

          {/* Lead */}

          <div>
            <label
              htmlFor="lead"
              className="font-medium text-slate-800"
            >
              Lead / Introduction
            </label>

            <textarea
              id="lead"
              name="lead"
              rows={7}
              value={form.lead}
              onChange={handleBasicChange}
              placeholder="Write the introductory section of the article..."
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
              disabled={loading}
            />

            <p className="mt-1 text-sm text-slate-500">
              This is the introduction readers
              see before the main sections.
            </p>
          </div>
        </div>
      </section>

      {/* ================================
          INFOBOX
      ================================= */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Infobox
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Structured facts displayed beside
            the article.
          </p>
        </div>

        <div className="space-y-5">
          {/* Image */}

          <div>
            <label
              htmlFor="infobox-image"
              className="font-medium text-slate-800"
            >
              Image URL
            </label>

            <input
              id="infobox-image"
              type="url"
              value={form.infobox.image}
              onChange={(e) =>
                handleInfoboxChange(
                  "image",
                  e.target.value
                )
              }
              placeholder="https://example.com/image.jpg"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              disabled={loading}
            />
          </div>

          {/* Caption */}

          <div>
            <label
              htmlFor="infobox-caption"
              className="font-medium text-slate-800"
            >
              Image Caption
            </label>

            <input
              id="infobox-caption"
              type="text"
              value={form.infobox.caption}
              onChange={(e) =>
                handleInfoboxChange(
                  "caption",
                  e.target.value
                )
              }
              placeholder="The Taj Mahal in Agra"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              disabled={loading}
            />
          </div>

          {/* Fields */}

          <div className="border-t border-slate-200 pt-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">
                  Infobox Fields
                </h3>

                <p className="text-sm text-slate-500">
                  Example: Location → Agra,
                  India
                </p>
              </div>

              <button
                type="button"
                onClick={addInfoboxField}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
              >
                + Add Field
              </button>
            </div>

            <div className="space-y-3">
              {form.infobox.fields.map(
                (field, index) => (
                  <div
                    key={index}
                    className="flex gap-3"
                  >
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) =>
                        updateInfoboxField(
                          index,
                          "label",
                          e.target.value
                        )
                      }
                      placeholder="Label"
                      className="w-1/3 rounded-lg border border-slate-300 px-4 py-3"
                      disabled={loading}
                    />

                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) =>
                        updateInfoboxField(
                          index,
                          "value",
                          e.target.value
                        )
                      }
                      placeholder="Value"
                      className="flex-1 rounded-lg border border-slate-300 px-4 py-3"
                      disabled={loading}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeInfoboxField(index)
                      }
                      className="rounded-lg border border-red-200 px-4 text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================================
          ARTICLE SECTIONS
      ================================= */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Article Sections
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Build the main body of the encyclopedia
              article.
            </p>
          </div>

          <button
            type="button"
            onClick={addSection}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            + Add Section
          </button>
        </div>

        <div className="space-y-6">
          {form.sections.map(
            (section, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">
                    Section {index + 1}
                  </h3>

                  {form.sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        removeSection(index)
                      }
                      className="text-sm font-medium text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="font-medium text-slate-800">
                      Heading
                    </label>

                    <input
                      type="text"
                      value={section.heading}
                      onChange={(e) =>
                        updateSection(
                          index,
                          "heading",
                          e.target.value
                        )
                      }
                      placeholder="History"
                      className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="font-medium text-slate-800">
                      Content
                    </label>

                    <textarea
                      rows={10}
                      value={section.content}
                      onChange={(e) =>
                        updateSection(
                          index,
                          "content",
                          e.target.value
                        )
                      }
                      placeholder="Write this section..."
                      className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* ================================
          REFERENCES
      ================================= */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              References
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add reliable sources used for the
              article.
            </p>
          </div>

          <button
            type="button"
            onClick={addReference}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            + Add Reference
          </button>
        </div>

        <div className="space-y-6">
          {form.references.map(
            (reference, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">
                    Reference {index + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      removeReference(index)
                    }
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="font-medium">
                      Source Title
                    </label>

                    <input
                      type="text"
                      value={reference.title}
                      onChange={(e) =>
                        updateReference(
                          index,
                          "title",
                          e.target.value
                        )
                      }
                      placeholder="Archaeological Survey of India"
                      className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="font-medium">
                      Publisher
                    </label>

                    <input
                      type="text"
                      value={
                        reference.publisher
                      }
                      onChange={(e) =>
                        updateReference(
                          index,
                          "publisher",
                          e.target.value
                        )
                      }
                      placeholder="Government of India"
                      className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="font-medium">
                    URL
                  </label>

                  <input
                    type="url"
                    value={reference.url}
                    onChange={(e) =>
                      updateReference(
                        index,
                        "url",
                        e.target.value
                      )
                    }
                    placeholder="https://example.com/source"
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3"
                    disabled={loading}
                  />
                </div>

                <div className="mt-4">
                  <label className="font-medium">
                    Accessed Date
                  </label>

                  <input
                    type="datetime-local"
                    value={
                      reference.accessedAt
                    }
                    onChange={(e) =>
                      updateReference(
                        index,
                        "accessedAt",
                        e.target.value
                      )
                    }
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3"
                    disabled={loading}
                  />
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* ================================
          CATEGORIES
      ================================= */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          Categories
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Add multiple categories separated by
          commas.
        </p>

        <input
          type="text"
          value={form.categories.join(", ")}
          onChange={(e) =>
            handleCategoriesChange(
              e.target.value
            )
          }
          placeholder="Indian History, Architecture, Uttar Pradesh"
          className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-3"
          disabled={loading}
        />
      </section>

      {/* ================================
          OPTIONS
      ================================= */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          Publishing
        </h2>

        <div className="mt-5 space-y-5">
          {/* Status */}

          <div>
            <label
              htmlFor="status"
              className="font-medium"
            >
              Status
            </label>

            <select
              id="status"
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  status:
                    e.target.value as
                      | "draft"
                      | "published",
                }))
              }
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
              disabled={loading}
            >
              <option value="draft">
                Draft
              </option>

              <option value="published">
                Published
              </option>
            </select>
          </div>

          {/* Featured */}

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  featured:
                    e.target.checked,
                }))
              }
              className="h-5 w-5 rounded"
              disabled={loading}
            />

            <span className="font-medium text-slate-800">
              Feature this article on the
              homepage
            </span>
          </label>
        </div>
      </section>

      {/* ================================
          SUBMIT
      ================================= */}

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() =>
            router.push("/admin/articles")
          }
          disabled={loading}
          className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Creating Article..."
            : "Create Article"}
        </button>
      </div>
    </form>
  );
}