import ChangeBadge from "./ChangeBadge";

type Props = {
  changes?: {
    added?: any[];
    removed?: any[];
    modified?: any[];
  };
};

export default function InfoboxFieldChanges({
  changes,
}: Props) {
  if (!changes) return null;

  const hasChanges =
    changes.added?.length ||
    changes.removed?.length ||
    changes.modified?.length;

  if (!hasChanges) return null;

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-slate-700">
        Fields
      </h3>

      <div className="space-y-3">
        {changes.added?.map((field) => (
          <div
            key={field._id}
            className="rounded-lg border border-green-200 bg-green-50 p-4"
          >
            <ChangeBadge type="added">
              Added
            </ChangeBadge>

            <div className="mt-3 grid grid-cols-[140px_1fr] gap-4 text-sm">
              <span className="font-medium text-slate-600">
                {field.label}
              </span>

              <span className="font-medium text-green-700">
                {field.value}
              </span>
            </div>
          </div>
        ))}

        {changes.removed?.map((field) => (
          <div
            key={field._id}
            className="rounded-lg border border-red-200 bg-red-50 p-4"
          >
            <ChangeBadge type="removed">
              Removed
            </ChangeBadge>

            <div className="mt-3 grid grid-cols-[140px_1fr] gap-4 text-sm">
              <span className="font-medium text-slate-600">
                {field.label}
              </span>

              <span className="font-medium text-red-700 line-through">
                {field.value}
              </span>
            </div>
          </div>
        ))}

        {changes.modified?.map(
          (field, index) => (
            <div
              key={index}
              className="rounded-lg border border-blue-200 bg-blue-50 p-4"
            >
              <ChangeBadge type="modified">
                Modified
              </ChangeBadge>

              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-xs font-semibold uppercase text-red-600">
                    Previous
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    <strong>
                      {field.from.label}
                    </strong>
                    : {field.from.value}
                  </p>
                </div>

                <span className="hidden text-slate-400 sm:block">
                  →
                </span>

                <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                  <p className="text-xs font-semibold uppercase text-green-600">
                    New
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    <strong>
                      {field.to.label}
                    </strong>
                    : {field.to.value}
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
