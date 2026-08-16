import ChangeBadge from "./ChangeBadge";

type Props = {
  reference: any;
  type: "added" | "removed";
};

export default function ReferenceCard({
  reference,
  type,
}: Props) {
  if (!reference) return null;

  return (
    <div
      className={`rounded-lg border p-4 ${
        type === "added"
          ? "border-green-200 bg-green-50"
          : "border-red-200 bg-red-50"
      }`}
    >
      <ChangeBadge type={type}>
        {type === "added"
          ? "Added"
          : "Removed"}
      </ChangeBadge>

      <h3 className="mt-3 font-semibold text-slate-900">
        {reference.title}
      </h3>

      {reference.publisher && (
        <p className="mt-1 text-sm text-slate-500">
          {reference.publisher}
        </p>
      )}

      <a
        href={reference.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 block break-all text-sm text-blue-600 hover:underline"
      >
        {reference.url}
      </a>

      {reference.description && (
        <p className="mt-2 text-sm text-slate-600">
          {reference.description}
        </p>
      )}

      {reference.accessedAt && (
        <p className="mt-2 text-xs text-slate-400">
          Accessed{" "}
          {new Date(
            reference.accessedAt
          ).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}