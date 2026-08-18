import TextDiff from "./blocks/TextDiff";
import type {
  InfoboxData,
  InfoboxField,
} from "@/types/article-diff";

type Props = {
  from?: InfoboxData;
  to?: InfoboxData;
};


function Value({
  value,
}: {
  value: unknown;
}) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return (
      <span className="text-slate-400">
        —
      </span>
    );
  }

  return (
    <span className="break-words text-sm text-slate-700">
      {String(value)}
    </span>
  );
}

function PropertyDiff({
  label,
  from,
  to,
}: {
  label: string;
  from: unknown;
  to: unknown;
}) {
  const oldValue = String(from ?? "");
  const newValue = String(to ?? "");

  if (oldValue === newValue) {
    return (
      <div className="border-b border-slate-200 py-3 last:border-b-0">
        <p className="mb-1 text-xs font-semibold uppercase text-slate-500">
          {label}
        </p>

        <Value value={from} />
      </div>
    );
  }

  return (
    <div className="border-b border-slate-200 py-3 last:border-b-0">
      <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
        {label}
      </p>

      <TextDiff
        from={oldValue}
        to={newValue}
      />
    </div>
  );
}

function FieldDiff({
  from,
  to,
}: {
  from?: InfoboxField;
  to?: InfoboxField;
}) {
  if (!from && to) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <p className="mb-2 text-xs font-semibold uppercase text-green-700">
          Added field
        </p>

        <p className="text-sm font-semibold text-slate-900">
          {to.label}
        </p>

        <div className="mt-2">
          <Value value={to.value} />
        </div>
      </div>
    );
  }

  if (from && !to) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="mb-2 text-xs font-semibold uppercase text-red-700">
          Removed field
        </p>

        <p className="text-sm font-semibold text-slate-900">
          {from.label}
        </p>

        <div className="mt-2">
          <Value value={from.value} />
        </div>
      </div>
    );
  }

  if (!from || !to) {
    return null;
  }

  const labelChanged =
    from.label !== to.label;

  const valueChanged =
    from.value !== to.value;

  const orderChanged =
    from.order !== to.order;

  if (
    !labelChanged &&
    !valueChanged &&
    !orderChanged
  ) {
    return null;
  }

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
      <p className="mb-3 text-xs font-semibold uppercase text-blue-700">
        Modified field
      </p>

      {labelChanged && (
        <PropertyDiff
          label="Label"
          from={from.label}
          to={to.label}
        />
      )}

      {valueChanged && (
        <PropertyDiff
          label="Value"
          from={from.value}
          to={to.value}
        />
      )}

      {orderChanged && (
        <PropertyDiff
          label="Order"
          from={from.order}
          to={to.order}
        />
      )}
    </div>
  );
}

export default function InfoboxDiff({
  from,
  to,
}: Props) {
  /**
   * Infobox added
   */
  if (!from && to) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-5">
        <p className="mb-4 text-xs font-semibold uppercase text-green-700">
          Infobox added
        </p>

        <div className="space-y-3">
          <PropertyDiff
            label="Title"
            from=""
            to={to.title}
          />

          <PropertyDiff
            label="Image"
            from=""
            to={to.image}
          />
        </div>

        {to.fields?.length > 0 && (
          <div className="mt-5">
            <p className="mb-3 text-sm font-semibold text-slate-900">
              Fields
            </p>

            <div className="space-y-3">
              {to.fields.map(
                (
                  field: InfoboxField,
                  index: number
                ) => (
                  <FieldDiff
                    key={
                      field.label ??
                      `added-${index}`
                    }
                    to={field}
                  />
                )
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  /**
   * Infobox removed
   */
  if (from && !to) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5">
        <p className="mb-4 text-xs font-semibold uppercase text-red-700">
          Infobox removed
        </p>

        <div className="space-y-3">
          <PropertyDiff
            label="Title"
            from={from.title}
            to=""
          />

          <PropertyDiff
            label="Image"
            from={from.image}
            to=""
          />
        </div>

        {from.fields?.length > 0 && (
          <div className="mt-5">
            <p className="mb-3 text-sm font-semibold text-slate-900">
              Fields
            </p>

            <div className="space-y-3">
              {from.fields.map(
                (
                  field: InfoboxField,
                  index: number
                ) => (
                  <FieldDiff
                    key={
                      field.label ??
                      `removed-${index}`
                    }
                    from={field}
                  />
                )
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  /**
   * Nothing to compare
   */
  if (!from || !to) {
    return null;
  }

  const fieldsFrom: InfoboxField[] =
    from.fields ?? [];

  const fieldsTo: InfoboxField[] =
    to.fields ?? [];

  /**
   * Match fields by label.
   *
   * We intentionally don't compare
   * MongoDB _id values.
   */
  const fromMap = new Map(
    fieldsFrom.map((field) => [
      field.label,
      field,
    ])
  );

  const toMap = new Map(
    fieldsTo.map((field) => [
      field.label,
      field,
    ])
  );

  const labels = Array.from(
    new Set([
      ...fieldsFrom.map(
        (field) => field.label
      ),
      ...fieldsTo.map(
        (field) => field.label
      ),
    ])
  );

  const changedFields = labels
    .map((label) => ({
      from: fromMap.get(label),
      to: toMap.get(label),
    }))
    .filter(
      ({ from, to }) =>
        from || to
    );

  const titleChanged =
    from.title !== to.title;

  const imageChanged =
    from.image !== to.image;

  const fieldsChanged =
    changedFields.some(
      ({ from: oldField, to: newField }) => {
        if (!oldField || !newField) {
          return true;
        }

        return (
          oldField.value !==
            newField.value ||
          oldField.order !==
            newField.order
        );
      }
    );

  if (
    !titleChanged &&
    !imageChanged &&
    !fieldsChanged
  ) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-500">
          No infobox properties changed.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
      <p className="mb-4 text-xs font-semibold uppercase text-blue-700">
        Modified infobox
      </p>

      {titleChanged && (
        <PropertyDiff
          label="Title"
          from={from.title}
          to={to.title}
        />
      )}

      {imageChanged && (
        <PropertyDiff
          label="Image"
          from={from.image}
          to={to.image}
        />
      )}

      {changedFields.length > 0 && (
        <div className="mt-5">
          <p className="mb-3 text-sm font-semibold text-slate-900">
            Fields
          </p>

          <div className="space-y-3">
            {changedFields.map(
              (
                field,
                index
              ) => (
                <FieldDiff
                  key={
                    field.from?.label ??
                    field.to?.label ??
                    `field-${index}`
                  }
                  from={field.from}
                  to={field.to}
                />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}