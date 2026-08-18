"use client";

import { FormEvent, useState } from "react";
import SectionEditor from "./SectionEditor";
import type { ArticleEditorProps, ArticleEditorSection, } from "@/types/article-editor";


type Block = {
  type: "paragraph" | "heading";
  content: unknown;
  order: number;
};

type Section = {
  title: string;
  level: number;
  blocks: Block[];
  order: number;
};

export default function ArticleEditor({
  articleId,
  revisionId,
  title: initialTitle,
  summary: initialSummary,
  categories: initialCategories,
  sections: initialSections,
}: ArticleEditorProps) {

  const [title, setTitle] = useState(initialTitle);
  const [summary, setSummary] = useState(initialSummary);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sections, setSections] = useState<ArticleEditorSection[]>(initialSections);
  const categories = initialCategories;


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      // We will connect this to createRevision()
      // in the next step.

      console.log({
        articleId,
        revisionId,
        title,
        summary,
        categories,
      });

      setMessage(
        "Editor data is ready to be saved."
      );
    } catch (error) {
      console.error(error);

      setMessage(
        "Failed to save changes."
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
    section: Section
  ) {
    setSections((current) => {
      const updated = [...current];

      updated[index] = section;

      return updated;
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
        <h2 className="text-sm font-medium text-slate-700">
          Categories
        </h2>

        {categories.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category._id}
                className="rounded-full bg-blue-50 px-3 py-1.5 text-sm text-blue-700"
              >
                {category.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-500">
            No categories assigned.
          </p>
        )}
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
            />
          ))}
        </div>
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