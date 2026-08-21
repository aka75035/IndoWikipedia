import type {
  ArticleEditorSection,
} from "@/types/article-editor";

type Props = {
  sections: ArticleEditorSection[];
};

function createSectionId(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ArticleToc({
  sections,
}: Props) {
  const sortedSections = sections
    .slice()
    .sort((a, b) => a.order - b.order);

  if (sortedSections.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Table of contents"
      className="hidden md:block md:w-full"
    >
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Contents
      </h2>

      <ol className="mt-3 border-l border-slate-200">
        {sortedSections.map(
          (section, index) => {
            const sectionId = createSectionId(section.title);

            return (
              <li
                key={`${section.order}-${section.title}`}
              >
                <a
                  href={`#${sectionId}`}
                  className="group flex gap-3 border-l-2 border-transparent py-2 pl-3 text-sm leading-5 text-slate-600 transition-colors hover:border-blue-500 hover:bg-slate-50 hover:text-blue-700"
                >
                  <span className="shrink-0 font-medium text-slate-400 group-hover:text-blue-500">
                    {index + 1}.
                  </span>

                  <span className="min-w-0 break-words">
                    {section.title}
                  </span>
                </a>
              </li>
            );
          }
        )}
      </ol>
    </nav>
  );
}