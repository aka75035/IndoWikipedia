import type {
  ArticleEditorInfobox,
} from "@/types/article-editor";

type Props = {
  infobox: ArticleEditorInfobox | null;
};

export default function ArticleInfobox({
  infobox,
}: Props) {
  if (!infobox) {
    return null;
  }

  const fields = infobox.fields
    .slice()
    .sort((a, b) => a.order - b.order);

  return (
    <aside
      aria-label={infobox.title}
      className="w-full max-w-[320px] overflow-hidden border border-slate-300 bg-slate-50 text-sm"
    >
      
      <div className="border-b border-slate-300 bg-slate-100 px-4 py-3 text-center">
        <h2 className="text-base font-bold leading-6 text-slate-950">
          {infobox.title}
        </h2>
      </div>

      
      {infobox.image && (
        <div className="border-b border-slate-300 bg-white p-3">
          <img
            src={infobox.image}
            alt={infobox.title}
            loading="lazy"
            className="mx-auto max-h-72 w-auto max-w-full object-contain"
          />
        </div>
      )}

      
      {fields.length > 0 && (
        <dl className="divide-y divide-slate-200">
          {fields.map((field) => (
            <div
              key={`${field.order}-${field.label}`}
              className="grid grid-cols-[40%_60%] gap-2 px-3 py-2.5 sm:px-4"
            >
              <dt className="break-words font-semibold leading-5 text-slate-600">
                {field.label}
              </dt>

              <dd className="min-w-0 break-words leading-5 text-slate-900">
                {field.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </aside>
  );
}