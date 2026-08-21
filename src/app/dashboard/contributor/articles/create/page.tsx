import { redirect } from "next/navigation";

import { requireContributor } from "@/lib/auth";

import CreateArticleForm from "@/components/Dashboard/Contributor/CreateArticleForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Article",
  description:
    "Create a new article for IndoWikipedia.",
  robots: {
    index: false,
    follow: false,
  },
};
export default async function CreateArticlePage() {
  const auth = await requireContributor();

  if (auth.status !== 200 || !auth.user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-600">
          Contributor
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Create Article
        </h1>

        <p className="mt-2 text-slate-500">
          Start a new article for IndoWikipedia.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <CreateArticleForm />
      </div>
    </div>
  );
}