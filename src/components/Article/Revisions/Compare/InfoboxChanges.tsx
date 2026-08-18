import CollapsibleSection from "./CollapsibleSection";
import InfoboxDiff from "./InfoboxDiff";

import type {
  InfoboxChanges as InfoboxChangesType,
  InfoboxField,
  InfoboxFieldChange,
} from "@/types/article-diff";

type Props = {
  changes: InfoboxChangesType;
};

export default function InfoboxChanges({
  changes,
}: Props) {
  if (!changes) {
    return null;
  }
  function displayValue(value: unknown): string {
    if (value === null || value === undefined) {
      return "—";
    }

    if (typeof value === "string") {
      return value;
    }

    if (
      typeof value === "number" ||
      typeof value === "boolean" ||
      typeof value === "bigint"
    ) {
      return String(value);
    }

    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  const hasChanges =
    changes.changed === true ||
    changes.added ||
    changes.removed ||
    changes.title?.changed ||
    changes.image?.changed ||
    changes.fields?.added?.length ||
    changes.fields?.removed?.length ||
    changes.fields?.modified?.length;

  if (!hasChanges) {
    return null;
  }


  
  if (
    changes.added ||
    changes.removed
  ) {
    return (
      <CollapsibleSection
        title="Infobox"
        description="Changes to the article information box."
      >
        <InfoboxDiff
          from={changes.removed}
          to={changes.added}
        />
      </CollapsibleSection>
    );
  }

  /**
   * Detailed modified format:
   *
   * {
   *   title: {...},
   *   image: {...},
   *   fields: {...}
   * }
   *
   * This format already contains
   * the exact before/after values.
   */
  return (
    <CollapsibleSection
      title="Infobox"
      description="Changes to the article information box."
    >
      <div className="space-y-5">
        {changes.title?.changed && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
              Title
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="mb-1 text-[11px] font-semibold uppercase text-red-600">
                  Previous
                </p>

                <p className="text-sm text-red-900 line-through">
                  {displayValue(changes.title.from)}
                </p>
              </div>

              <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                <p className="mb-1 text-[11px] font-semibold uppercase text-green-600">
                  New
                </p>

                <p className="text-sm text-green-900">
                  {displayValue(changes.title.to)}
                </p>
              </div>
            </div>
          </div>
        )}

        {changes.image?.changed && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
              Image
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="mb-1 text-[11px] font-semibold uppercase text-red-600">
                  Previous
                </p>

                <p className="break-all text-sm text-red-900 line-through">
                  {displayValue(changes.image.from)}
                </p>
              </div>

              <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                <p className="mb-1 text-[11px] font-semibold uppercase text-green-600">
                  New
                </p>

                <p className="break-all text-sm text-green-900">
                  {displayValue(changes.image.to)}
                </p>
              </div>
            </div>
          </div>
        )}

        {changes.fields && (
          <div>
            <p className="mb-3 text-sm font-semibold text-slate-900">
              Fields
            </p>

            <div className="space-y-3">
              {changes.fields.added?.map(
                (field: InfoboxField, index: number) => (
                  <InfoboxDiff
                    key={`added-${index}`}
                    to={{
                      fields: [field],
                    }}
                  />
                )
              )}

              {changes.fields.removed?.map(
                (field: InfoboxField, index: number) => (
                  <InfoboxDiff
                    key={`removed-${index}`}
                    from={{
                      fields: [field],
                    }}
                  />
                )
              )}

              {changes.fields.modified?.map(
                (field: InfoboxFieldChange, index: number) => (
                  <div
                    key={`modified-${index}`}
                    className="rounded-lg border border-blue-200 bg-blue-50 p-4"
                  >
                    <p className="mb-3 text-xs font-semibold uppercase text-blue-700">
                      Modified field
                    </p>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                        <p className="mb-1 text-[11px] font-semibold uppercase text-red-600">
                          Previous
                        </p>

                        <p className="text-sm font-medium text-slate-900">
                          {field.from?.label}
                        </p>

                        <p className="mt-1 text-sm text-red-900">
                          {displayValue(field.from?.value)}
                        </p>
                      </div>

                      <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                        <p className="mb-1 text-[11px] font-semibold uppercase text-green-600">
                          New
                        </p>

                        <p className="text-sm font-medium text-slate-900">
                          {field.to?.label}
                        </p>

                        <p className="mt-1 text-sm text-green-900">
                          {displayValue(field.to?.value)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
}