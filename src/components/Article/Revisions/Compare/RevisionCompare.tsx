import ChangeSummary from "./ChangeSummary";
import InfoboxChanges from "./InfoboxChanges";
import ReferenceChanges from "./ReferenceChanges";
import SectionChanges from "./SectionChanges";
import type { RevisionComparison } from "@/types/article-diff";

type Props = {
  article: {
    id: string;
    slug: string;
  };
  from: number;
  to: number;
  changes: RevisionComparison;
};

export default function RevisionCompare({
  article,
  from,
  to,
  changes,
}: Props) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-8">
        <p className="text-sm text-slate-500">
          {article.slug}
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Revision Comparison
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Version {from} → Version {to}
        </p>
      </header>
      <ChangeSummary changes={changes} />

      <InfoboxChanges
        changes={changes.infobox}
      />

      <SectionChanges
        changes={changes.sections}
      />

      <ReferenceChanges
        changes={changes.references}
      />
    </main>
  );
}