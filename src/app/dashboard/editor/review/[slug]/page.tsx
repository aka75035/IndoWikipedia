import { notFound, redirect } from "next/navigation";

import { requireEditor } from "@/lib/auth";

import {
  getArticleForEditing,
} from "@/lib/services/article.service";

import ArticlePage from "@/components/Article/ArticlePage";

import ArticleReviewActions from "@/components/Dashboard/Editor/ArticleReview/ArticleReviewActions";
import { Metadata } from "next";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export const metadata: Metadata = {
  title: "Article Review",
  description:
    "Review a contributor-submitted article before publication on IndoWikipedia.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function EditorReviewPage({
  params,
}: Props) {
  const auth = await requireEditor();

  if (!auth.user) {
    redirect("/login");
  }

  const { slug } = await params;

  const article =
    await getArticleForEditing(slug);

  if (!article) {
    notFound();
  }

  const revision =
    article.currentRevision;

  if (!revision) {
    notFound();
  }

  /*
   * Only articles waiting for review
   * should be accessible here.
   */
  if (article.status !== "review") {
    redirect("/dashboard/editor");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Review toolbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          {/* Review information */}
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
              Editor Review
            </p>

            <h1 className="mt-1 truncate text-lg font-semibold text-slate-900">
              {revision.title}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Revision {revision.version}
            </p>
          </div>

          {/* Review actions */}
          <ArticleReviewActions
            slug={slug}
          />
        </div>
      </header>

      {/* Article preview */}
      <ArticlePage
        title={revision.title}
        summary={revision.summary}
        categories={revision.categories}
        sections={revision.sections}
        infobox={revision.infobox}
        references={revision.references}
        updatedAt={
          revision.updatedAt ??
          revision.createdAt
        }
        author={revision.createdBy}
        mode="review"
      />
    </div>
  );
}