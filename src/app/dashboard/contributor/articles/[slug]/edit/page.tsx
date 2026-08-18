import { notFound, redirect } from "next/navigation";

import { requireContributor } from "@/lib/auth";
import type { ArticleEditorSection, } from "@/types/article-editor";

import {
  getArticleForEditing,
} from "@/lib/services/article.service";

import ArticleEditor from "@/components/Dashboard/Contributor/ArticleEditor";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

type PopulatedCategory = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
};

export default async function EditArticlePage({
  params,
}: Props) {
  const auth = await requireContributor();

  if (auth.status !== 200 || !auth.user) {
    redirect("/login");
  }

  const { slug } = await params;

  const article =
    await getArticleForEditing(slug);

  if (!article) {
    notFound();
  }

  /**
   * Contributors can only edit
   * their own articles.
   */
  if (
    article.createdBy._id.toString() !==
    auth.user._id.toString()
  ) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-semibold text-red-800">
            You cannot edit this article
          </h1>

          <p className="mt-2 text-sm text-red-700">
            Contributors can only edit articles
            they created.
          </p>
        </div>
      </div>
    );
  }

  /**
   * Current revision
   */
  const revision = article.currentRevision;

  const sections =
  (revision?.sections as
    | ArticleEditorSection[]
    | undefined) ?? [];

  /**
   * Convert populated categories
   * into the shape expected by ArticleEditor.
   */
  const revisionCategories =
    (revision?.categories as
      | PopulatedCategory[]
      | undefined) ?? [];

  const categories = revisionCategories.map(
      (category) => ({
        _id: category._id.toString(),
        name: category.name,
        slug: category.slug,
      })
    );

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-600">
          Contributor
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Edit Article
        </h1>

        <p className="mt-2 text-slate-500">
          Edit and manage your article.
        </p>
      </div>

      {/* Article information */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm text-slate-500">
            Article
          </p>

          <h2 className="mt-1 text-2xl font-semibold text-slate-900">
            {article.title}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            /{article.slug}
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Status
            </p>

            <p className="mt-1 font-medium capitalize text-slate-900">
              {article.status}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Revision
            </p>

            <p className="mt-1 font-medium text-slate-900">
              {revision?.version ?? 0}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Categories
            </p>

            <p className="mt-1 font-medium text-slate-900">
              {categories.length}
            </p>
          </div>
        </div>
      </div>

      {/* Current revision */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Current Revision
        </h2>

        <div className="mt-5">
          <p className="text-sm text-slate-500">
            Revision title
          </p>

          <p className="mt-1 text-lg font-medium text-slate-900">
            {revision?.title ?? article.title}
          </p>
        </div>

        <div className="mt-5">
          <p className="text-sm text-slate-500">
            Summary
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-700">
            {revision?.summary ||
              "No summary has been added yet."}
          </p>
        </div>
      </div>

      {/* Editor */}
      <ArticleEditor
        articleId={article._id.toString()}
        revisionId={
          revision?._id.toString() ?? ""
        }
        title={
          revision?.title ?? article.title
        }
        summary={
          revision?.summary ?? ""
        }
        categories={categories}
        sections={sections}
      />
    </div>
  );
}