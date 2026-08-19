import type { ArticleEditorCategory } from "@/types/article-editor";

type Props = {
  title: string;
  summary: string;
  categories: ArticleEditorCategory[];
  updatedAt?: Date | string | null;
  author?: {
    username?: string;
    displayName?: string;
  } | null;
};

export default function ArticleHeader({
  title,
  summary,
  categories,
  updatedAt,
  author,
}: Props) {
  const formattedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const authorName =
    author?.displayName ||
    author?.username ||
    null;

  return (
    <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
      
      <div className="shrink-0">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
          {title}
        </h1>

        {(authorName || formattedDate) && (
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
            {authorName && (
              <span>
                Written by{" "}
                <span className="font-medium text-slate-700">
                  {authorName}
                </span>
              </span>
            )}

            {authorName && formattedDate && (
              <span
                aria-hidden="true"
                className="text-slate-300"
              >
                ·
              </span>
            )}

            {formattedDate && (
              <time
                dateTime={new Date(updatedAt!).toISOString()}
              >
                Last updated {formattedDate}
              </time>
            )}
          </div>
        )}

        {categories.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <span className="mr-1 font-medium text-slate-500">
              Categories:
            </span>

            {categories.map((category, index) => (
              <span key={category._id}>
                <span className="text-blue-700 hover:text-blue-900 hover:underline">
                  {category.name}
                </span>

                {index < categories.length - 1 && (
                  <span className="ml-2 text-slate-300">
                    ·
                  </span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>

      
      {summary && (
        <div className="min-w-0 flex-1 border-l border-slate-300 pl-6">
          <p className="text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
            {summary}
          </p>
        </div>
      )}
    </div>
  );
}