import type {
  InfoboxBlockContent,
} from "@/types/article-editor";

type Props = {
  content: InfoboxBlockContent;
};

export default function InfoboxBlock({
  content,
}: Props) {
  const fields = content.fields
    .slice()
    .sort(
      (a, b) => a.order - b.order
    );

  return (
    <aside
      aria-label={content.title}
      className="my-8 w-full max-w-md overflow-hidden border border-slate-300 bg-slate-50"
    >
      <div className="border-b border-slate-300 bg-slate-100 px-4 py-3 text-center">
        <h3 className="text-base font-bold leading-6 text-slate-950">
          {content.title}
        </h3>
      </div>

      {content.image && (
        <div className="border-b border-slate-300 bg-white p-4">
          <img
            src={content.image}
            alt={content.title}
            loading="lazy"
            className="mx-auto max-h-72 w-full object-contain"
          />
        </div>
      )}

      {fields.length > 0 && (
        <dl className="divide-y divide-slate-200">
          {fields.map((field) => (
            <div
              key={`${field.order}-${field.label}`}
              className="grid grid-cols-[38%_62%] gap-2 px-3 py-2.5 sm:px-4"
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