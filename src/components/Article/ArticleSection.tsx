import type {
  ArticleEditorSection,
} from "@/types/article-editor";

import ArticleBlockRenderer from "./blocks/ArticleBlockRenderer";

type Props = {
  section: ArticleEditorSection;
};

function createSectionId(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function SectionHeading({
  level,
  title,
}: {
  level: number;
  title: string;
}) {
  const safeLevel = Math.min(
    Math.max(level, 1),
    6
  );

  switch (safeLevel) {
    case 1:
      return (
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2rem]">
          {title}
        </h2>
      );

    case 2:
      return (
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-[1.75rem]">
          {title}
        </h2>
      );

    case 3:
      return (
        <h3 className="text-xl font-semibold text-slate-950 sm:text-2xl">
          {title}
        </h3>
      );

    case 4:
      return (
        <h4 className="text-lg font-semibold text-slate-950 sm:text-xl">
          {title}
        </h4>
      );

    case 5:
      return (
        <h5 className="text-base font-semibold text-slate-950 sm:text-lg">
          {title}
        </h5>
      );

    case 6:
      return (
        <h6 className="text-base font-semibold text-slate-900">
          {title}
        </h6>
      );

    default:
      return null;
  }
}

export default function ArticleSection({
  section,
}: Props) {
  const headingId = createSectionId(
    section.title
  );

  const blocks = section.blocks
    .slice()
    .sort(
      (a, b) => a.order - b.order
    );

  return (
    <section
      id={headingId}
      className="scroll-mt-24 border-b border-slate-200 py-8 first:pt-0 last:border-b-0 sm:py-10"
    >
      <SectionHeading
        level={section.level}
        title={section.title}
      />

      <div className="mt-5 space-y-6">
        {blocks.map((block) => (
          <ArticleBlockRenderer
            key={`${block.order}-${block.type}`}
            block={block}
          />
        ))}
      </div>
    </section>
  );
}