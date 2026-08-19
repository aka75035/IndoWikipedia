import TextDiff from "./TextDiff";

import type {
  LinkContent,
  RevisionBlock,
} from "@/types/article-diff";

type Props = {
  from: RevisionBlock;
  to?: RevisionBlock;
};

function getLinkContent(
  content: unknown
): LinkContent {
  if (
    typeof content !== "object" ||
    content === null
  ) {
    return {};
  }

  const value = content as Record<
    string,
    unknown
  >;

  return {
    text:
      typeof value.text === "string"
        ? value.text
        : undefined,

    url:
      typeof value.url === "string"
        ? value.url
        : undefined,
  };
}

function LinkContent({
  content,
}: {
  content: LinkContent;
}) {
  return (
    <div className="space-y-3">
      <div>
        <p className="mb-1 text-xs font-medium text-slate-500">
          Text
        </p>

        <p className="text-sm font-medium text-slate-900">
          {content.text ?? "—"}
        </p>
      </div>

      <div>
        <p className="mb-1 text-xs font-medium text-slate-500">
          URL
        </p>

        {content.url ? (
          <a
            href={content.url}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-sm text-blue-600 hover:underline"
          >
            {content.url}
          </a>
        ) : (
          <p className="text-sm text-slate-400">
            —
          </p>
        )}
      </div>
    </div>
  );
}

export default function LinkDiff({
  from,
  to,
}: Props) {
  const oldContent = getLinkContent(
    from.content
  );

  
  if (!to) {
    return (
      <LinkContent
        content={oldContent}
      />
    );
  }

  const newContent = getLinkContent(
    to.content
  );

  const textChanged =
    oldContent.text !== newContent.text;

  const urlChanged =
    oldContent.url !== newContent.url;

  return (
    <div className="space-y-5">
      {textChanged ? (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
            Link text
          </p>

          <TextDiff
            from={oldContent.text ?? ""}
            to={newContent.text ?? ""}
          />
        </div>
      ) : (
        <div>
          <p className="mb-1 text-xs font-medium text-slate-500">
            Text
          </p>

          <p className="text-sm text-slate-700">
            {oldContent.text ?? "—"}
          </p>
        </div>
      )}

      {urlChanged ? (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
            URL
          </p>

          <TextDiff
            from={oldContent.url ?? ""}
            to={newContent.url ?? ""}
          />
        </div>
      ) : (
        <div>
          <p className="mb-1 text-xs font-medium text-slate-500">
            URL
          </p>

          {oldContent.url ? (
            <a
              href={oldContent.url}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-sm text-blue-600 hover:underline"
            >
              {oldContent.url}
            </a>
          ) : (
            <p className="text-sm text-slate-400">
              —
            </p>
          )}
        </div>
      )}
    </div>
  );
}