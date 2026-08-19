import type {
  ArticleEditorReference,
} from "@/types/article-editor";

type Props = {
  references: ArticleEditorReference[];
};

export default function ArticleReferences({
  references,
}: Props) {
  if (references.length === 0) {
    return null;
  }

  return (
    <section
      id="references"
      className="border-t border-slate-300 pt-8 scroll-mt-24"
    >
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
        References
      </h2>

      <ol className="mt-6 max-w-4xl space-y-4 pl-6 marker:text-slate-400">
        {references.map((reference, index) => {
          const key =
            reference._id ??
            `${reference.url}-${index}`;

          return (
            <li
              key={key}
              className="pl-2 text-sm leading-6 text-slate-700"
            >
              <a
                href={reference.url}
                target="_blank"
                rel="noopener noreferrer"
                className="break-words font-medium text-blue-700 underline decoration-blue-200 underline-offset-2 transition-colors hover:text-blue-900 hover:decoration-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {reference.title}
              </a>

              {(reference.author ||
                reference.publisher) && (
                <span className="text-slate-500">
                  {" "}
                  —{" "}
                  {reference.author}

                  {reference.author &&
                    reference.publisher &&
                    ", "}

                  {reference.publisher}
                </span>
              )}

              {reference.description && (
                <p className="mt-1 text-slate-600">
                  {reference.description}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}