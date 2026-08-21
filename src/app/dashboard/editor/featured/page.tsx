import { redirect } from "next/navigation";

import { requireEditor } from "@/lib/auth";

import {getPublishedArticles} from "@/lib/services/article.service";

import FeaturedArticles from "@/components/Dashboard/Editor/FeaturedArticles/FeaturedArticles";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Featured Articles",
  description:
    "Manage featured articles on IndoWikipedia.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function EditorFeaturedPage() {
  const auth = await requireEditor();

  if (auth.status !== 200 || !auth.user) {
    redirect("/login");
  }

  const result =
    await getPublishedArticles(1);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <FeaturedArticles
        articles={result.articles}
      />
    </main>
  );
}