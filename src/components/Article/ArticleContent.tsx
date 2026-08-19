import type { ArticleEditorSection } from "@/types/article-editor";

import ArticleSection from "./ArticleSection";

type Props = {
  sections: ArticleEditorSection[];
};

export default function ArticleContent({
  sections,
}: Props) {
  const sortedSections = sections
    .slice()
    .sort((a, b) => a.order - b.order);

  if (sortedSections.length === 0) {
    return (
      <div className="border-y border-slate-200 py-8 text-sm text-slate-500">
        This article does not have any sections yet.
      </div>
    );
  }

  return (
    <div className="max-w-none">
      {sortedSections.map((section) => (
        <ArticleSection
          key={`${section.order}-${section.title}`}
          section={section}
        />
      ))}
    </div>
  );
}