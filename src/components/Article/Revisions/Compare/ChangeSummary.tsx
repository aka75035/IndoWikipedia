import ChangeStat from "./ChangeStat";

type Props = {
  changes: any;
};

export default function ChangeSummary({
  changes,
}: Props) {
  const sections = changes?.sections;
  const references = changes?.references;
  const categories = changes?.categories;
  const media = changes?.media;

  const titleChanged =
    changes?.title?.changed ?? false;

  const summaryChanged =
    changes?.summary?.changed ?? false;

  const infoboxChanged =
    changes?.infobox?.changed ?? false;

  const sectionChanges =
    (sections?.added?.length ?? 0) +
    (sections?.removed?.length ?? 0) +
    (sections?.modified?.length ?? 0);

  const blockChanges =
    (sections?.modified ?? []).reduce(
      (total: number, section: any) =>
        total +
        (section.blocks?.added?.length ?? 0) +
        (section.blocks?.removed?.length ?? 0) +
        (section.blocks?.modified?.length ?? 0),
      0
    ) +
    (sections?.added ?? []).reduce(
      (total: number, section: any) =>
        total + (section.blocks?.length ?? 0),
      0
    ) +
    (sections?.removed ?? []).reduce(
      (total: number, section: any) =>
        total + (section.blocks?.length ?? 0),
      0
    );

  const referenceChanges =
    (references?.added?.length ?? 0) +
    (references?.removed?.length ?? 0) +
    (references?.modified?.length ?? 0);

  const categoryChanges =
    (categories?.added?.length ?? 0) +
    (categories?.removed?.length ?? 0);

  const mediaChanges =
    (media?.added?.length ?? 0) +
    (media?.removed?.length ?? 0) +
    (media?.modified?.length ?? 0);

  const metadataChanges =
    Number(titleChanged) +
    Number(summaryChanged) +
    Number(infoboxChanged);

  return (
    <section className="mb-8">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Change Summary
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Overview of what changed between
          the two revisions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <ChangeStat
          label="Metadata"
          value={metadataChanges}
        />

        <ChangeStat
          label="Sections"
          value={sectionChanges}
        />

        <ChangeStat
          label="Blocks"
          value={blockChanges}
        />

        <ChangeStat
          label="References"
          value={referenceChanges}
        />

        <ChangeStat
          label="Categories"
          value={categoryChanges}
        />

        <ChangeStat
          label="Media"
          value={mediaChanges}
        />
      </div>
    </section>
  );
}