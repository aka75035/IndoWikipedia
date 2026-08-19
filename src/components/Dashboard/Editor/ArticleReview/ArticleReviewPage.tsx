"use client";

import ArticlePage from "@/components/Article/ArticlePage";
import ArticleReviewActions from "./ArticleReviewActions";

import type {
  ArticleEditorCategory,
  ArticleEditorSection,
  ArticleEditorInfobox,
  ArticleEditorReference,
} from "@/types/article-editor";

type ArticleAuthor = {
  username?: string;
  displayName?: string;
};

type Props = {
  slug: string;
  title: string;
  summary: string;
  categories: ArticleEditorCategory[];
  sections: ArticleEditorSection[];
  infobox: ArticleEditorInfobox | null;
  references: ArticleEditorReference[];
  updatedAt?: Date | string | null;
  author?: ArticleAuthor | null;
  revisionVersion?: number;
};

export default function ArticleReviewPage({
  slug,
  title,
  summary,
  categories,
  sections,
  infobox,
  references,
  updatedAt,
  author,
  revisionVersion,
}: Props) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Review toolbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
          {/* Review information */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                Editor Review
              </span>

              {revisionVersion !== undefined && (
                <span className="text-xs text-slate-400">
                  Revision {revisionVersion}
                </span>
              )}
            </div>

            <h1 className="mt-1 truncate text-base font-semibold text-slate-900 sm:text-lg">
              {title}
            </h1>
          </div>

          {/* Review actions */}
          <ArticleReviewActions
            slug={slug}
          />
        </div>
      </header>

      {/* Article preview */}
      <ArticlePage
        title={title}
        summary={summary}
        categories={categories}
        sections={sections}
        infobox={infobox}
        references={references}
        updatedAt={updatedAt}
        author={author}
        mode="review"
      />
    </div>
  );
}