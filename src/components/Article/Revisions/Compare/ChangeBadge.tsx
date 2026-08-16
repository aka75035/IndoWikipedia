type ChangeType =
  | "added"
  | "removed"
  | "modified";

type Props = {
  type: ChangeType;
  children: React.ReactNode;
};

export default function ChangeBadge({
  type,
  children,
}: Props) {
  const styles = {
    added:
      "bg-green-100 text-green-700",
    removed:
      "bg-red-100 text-red-700",
    modified:
      "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold uppercase ${styles[type]}`}
    >
      {children}
    </span>
  );
}
