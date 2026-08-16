import ReferenceDiff from "./ReferenceDiff";
import CollapsibleSection from "./CollapsibleSection";

type Props = {
  changes: {
    added?: any[];
    removed?: any[];
    modified?: any[];
  };
};

export default function ReferenceChanges({
  changes,
}: Props) {
  if (!changes) {
    return null;
  }

  const added =
    changes.added ?? [];

  const removed =
    changes.removed ?? [];

  const modified =
    changes.modified ?? [];

  const hasChanges =
    added.length > 0 ||
    removed.length > 0 ||
    modified.length > 0;

  if (!hasChanges) {
    return null;
  }

  return (
    <CollapsibleSection
      title="References"
      description="Sources added, removed, or modified."
    >
      <div className="space-y-6">

        {/* Added references */}
        {added.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-green-700">
              Added
            </h3>

            <div className="space-y-4">
              {added.map(
                (
                  reference: any,
                  index: number
                ) => (
                  <ReferenceDiff
                    key={
                      reference._id ??
                      `added-${index}`
                    }
                    to={reference}
                  />
                )
              )}
            </div>
          </div>
        )}

        {/* Removed references */}
        {removed.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-red-700">
              Removed
            </h3>

            <div className="space-y-4">
              {removed.map(
                (
                  reference: any,
                  index: number
                ) => (
                  <ReferenceDiff
                    key={
                      reference._id ??
                      `removed-${index}`
                    }
                    from={reference}
                  />
                )
              )}
            </div>
          </div>
        )}

        {/* Modified references */}
        {modified.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-blue-700">
              Modified
            </h3>

            <div className="space-y-4">
              {modified.map(
                (
                  change: any,
                  index: number
                ) => (
                  <ReferenceDiff
                    key={`modified-${index}`}
                    from={change.from}
                    to={change.to}
                  />
                )
              )}
            </div>
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
}