import ChangeBadge from "./ChangeBadge";
import BlockChanges from "./BlockChanges";
import CollapsibleSection from "./CollapsibleSection";
import type { SectionChanges } from "@/types/article-diff";

type Props = {
  changes: SectionChanges;
};

export default function SectionChanges({
  changes,
}: Props) {
  const hasChanges =
    changes?.added?.length ||
    changes?.removed?.length ||
    changes?.modified?.length;

  if (!hasChanges) {
    return null;
  }

  return (
    <CollapsibleSection title="Sections" description="Sections and content blocks changed between revisions.">
      <h2 className="mb-6 text-lg font-semibold text-slate-900">
        Sections
      </h2>

      <div className="space-y-6">

        {/* Added sections */}
        {changes.added?.map(
          (section) => (
            <div
              key={section._id}
              className="rounded-xl border border-green-200 bg-green-50 p-5"
            >
              <ChangeBadge type="added">
                Added
              </ChangeBadge>

              <div className="mt-3">
                <h3 className="text-base font-semibold text-slate-900">
                  {section.title}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Level {section.level}
                </p>
              </div>

              <div className="mt-5">
                <BlockChanges
                  changes={{
                    added: section.blocks ?? [],
                    removed: [],
                    modified: [],
                  }}
                />
              </div>
            </div>
          )
        )}

        {/* Removed sections */}
        {changes.removed?.map(
          (section) => (
            <div
              key={section._id}
              className="rounded-xl border border-red-200 bg-red-50 p-5"
            >
              <ChangeBadge type="removed">
                Removed
              </ChangeBadge>

              <div className="mt-3">
                <h3 className="text-base font-semibold text-slate-900">
                  {section.title}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Level {section.level}
                </p>
              </div>

              <div className="mt-5">
                <BlockChanges
                  changes={{
                    added: [],
                    removed: section.blocks ?? [],
                    modified: [],
                  }}
                />
              </div>
            </div>
          )
        )}

        {/* Modified sections */}
        {changes.modified?.map(
          (section, index) => (
            <div
              key={
                section.from?._id ??
                section.to?._id ??
                index
              }
              className="rounded-xl border border-blue-200 bg-blue-50 p-5"
            >
              <ChangeBadge type="modified">
                Modified
              </ChangeBadge>

              <div className="mt-3">
                <h3 className="text-base font-semibold text-slate-900">
                  {section.to?.title ??
                    section.from?.title}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Section changed
                </p>
              </div>

              <div className="mt-5">
                <BlockChanges
                  changes={
                    section.blocks ?? {
                      added: [],
                      removed: [],
                      modified: [],
                    }
                  }
                />
              </div>
            </div>
          )
        )}
      </div>
    </CollapsibleSection>
  );
}