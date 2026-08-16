import TextDiff from "./blocks/TextDiff";

type Props = {
  from?: any;
  to?: any;
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

function Property({
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

  const changed = oldValue !== newValue;

  return (
    <div className="border-b border-slate-200 py-4 last:border-b-0">
      <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
        {label}
      </p>

      {changed ? (
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="mb-1 text-[11px] font-semibold uppercase text-red-600">
              Previous
            </p>

            <Value value={from} />
          </div>

          <div className="rounded-lg border border-green-200 bg-green-50 p-3">
            <p className="mb-1 text-[11px] font-semibold uppercase text-green-600">
              New
            </p>

            <Value value={to} />
          </div>
        </div>
      ) : (
        <Value value={from} />
      )}
    </div>
  );
}

export default function ReferenceDiff({
  from,
  to,
}: Props) {
  /**
   * Removed reference
   */
  if (!to) {
    const content = from ?? {};

    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="mb-4 text-xs font-semibold uppercase text-red-600">
          Removed reference
        </p>

        <Property
          label="Title"
          from={content.title}
          to={undefined}
        />

        <Property
          label="URL"
          from={content.url}
          to={undefined}
        />

        <Property
          label="Publisher"
          from={content.publisher}
          to={undefined}
        />

        <Property
          label="Accessed"
          from={content.accessedAt}
          to={undefined}
        />

        <Property
          label="Description"
          from={content.description}
          to={undefined}
        />
      </div>
    );
  }

  /**
   * Added reference
   *
   * `from` can be undefined when this
   * component is used for an added item.
   */
  if (!from) {
    const content = to ?? {};

    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <p className="mb-4 text-xs font-semibold uppercase text-green-600">
          Added reference
        </p>

        <Property
          label="Title"
          from={undefined}
          to={content.title}
        />

        <Property
          label="URL"
          from={undefined}
          to={content.url}
        />

        <Property
          label="Publisher"
          from={undefined}
          to={content.publisher}
        />

        <Property
          label="Accessed"
          from={undefined}
          to={content.accessedAt}
        />

        <Property
          label="Description"
          from={undefined}
          to={content.description}
        />
      </div>
    );
  }

  /**
   * Modified reference
   */
  const oldContent = from ?? {};
  const newContent = to ?? {};

  const titleChanged =
    oldContent.title !== newContent.title;

  const urlChanged =
    oldContent.url !== newContent.url;

  const publisherChanged =
    oldContent.publisher !==
    newContent.publisher;

  const accessedChanged =
    oldContent.accessedAt !==
    newContent.accessedAt;

  const descriptionChanged =
    oldContent.description !==
    newContent.description;

  const changed =
    titleChanged ||
    urlChanged ||
    publisherChanged ||
    accessedChanged ||
    descriptionChanged;

  if (!changed) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-600">
          No reference properties changed.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase text-blue-600">
          Modified reference
        </p>
      </div>

      <Property
        label="Title"
        from={oldContent.title}
        to={newContent.title}
      />

      <Property
        label="URL"
        from={oldContent.url}
        to={newContent.url}
      />

      <Property
        label="Publisher"
        from={oldContent.publisher}
        to={newContent.publisher}
      />

      <Property
        label="Accessed"
        from={oldContent.accessedAt}
        to={newContent.accessedAt}
      />

      {descriptionChanged ? (
        <div className="border-b border-slate-200 py-4">
          <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
            Description
          </p>

          <TextDiff
            from={String(
              oldContent.description ?? ""
            )}
            to={String(
              newContent.description ?? ""
            )}
          />
        </div>
      ) : (
        <Property
          label="Description"
          from={oldContent.description}
          to={newContent.description}
        />
      )}
    </div>
  );
}