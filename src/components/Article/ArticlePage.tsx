import type {
  ArticleEditorCategory,
  ArticleEditorSection,
  ArticleEditorInfobox,
  ArticleEditorReference,
} from "@/types/article-editor";

import ArticleHeader from "./ArticleHeader";
import ArticleContent from "./ArticleContent";
import ArticleToc from "./ArticleToc";
import ArticleInfobox from "./ArticleInfobox";
import ArticleReferences from "./ArticleReferences";

type ArticleAuthor = {
  username?: string;
  displayName?: string;
};

type Props = {
  title: string;
  summary: string;
  categories: ArticleEditorCategory[];
  sections: ArticleEditorSection[];
  infobox: ArticleEditorInfobox | null;
  references: ArticleEditorReference[];
  updatedAt?: Date | string | null;
  author?: ArticleAuthor | null;
  mode?: "public" | "review" | "preview";
};

export default function ArticlePage({
  title,
  summary,
  categories,
  sections,
  infobox,
  references,
  updatedAt,
  author,
  mode = "public",
}: Props) {
  return (
    <article className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        
        {mode !== "public" && (
          <div
            className="mb-8 border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-900"
            role="status"
          >
            <span className="font-semibold">
              {mode === "review"
                ? "Editor Review"
                : "Preview"}
            </span>

            <span className="mx-2 text-amber-600">
              ·
            </span>

            {mode === "review"
              ? "This article has not been published yet."
              : "This is how the article will appear to readers."}
          </div>
        )}

        
        <ArticleHeader
          title={title}
          summary={summary}
          categories={categories}
          updatedAt={updatedAt}
          author={author}
        />

        
        <div className="mt-8 border-t border-slate-200 pt-8 lg:mt-10 lg:pt-10">
          <div className="grid gap-8 lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[210px_minmax(0,1fr)]">
            
            <aside className="order-1 lg:order-none">
              <div className="lg:sticky lg:top-6">
                <ArticleToc sections={sections} />
              </div>
            </aside>

            
            <main className="min-w-0">
              
              <div className="max-w-[1100px]">
                
                {infobox && (
                  <div className="mb-8 md:float-right md:ml-8 md:mb-6 md:w-[280px] lg:w-[300px]">
                    <ArticleInfobox
                      infobox={infobox}
                    />
                  </div>
                )}

                
                <ArticleContent
                  sections={sections}
                />

                
                <div className="clear-both">
                  <ArticleReferences
                    references={references}
                  />
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </article>
  );
}