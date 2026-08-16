type Props = {
  label: string;
  from: unknown;
  to: unknown;
};

export default function SimpleChange({
  label,
  from,
  to,
}: Props) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-slate-700">
        {label}
      </h3>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-xs font-semibold uppercase text-red-600">
            Previous
          </p>

          <p className="mt-2 break-all text-sm text-slate-700">
            {String(from ?? "None")}
          </p>
        </div>

        <span className="hidden text-slate-400 sm:block">
          →
        </span>

        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-xs font-semibold uppercase text-green-600">
            New
          </p>

          <p className="mt-2 break-all text-sm text-slate-700">
            {String(to ?? "None")}
          </p>
        </div>
      </div>
    </div>
  );
}