import TextDiff from "./TextDiff";

type Props = {
  from: any;
  to?: any;
};

function LinkContent({
  block,
}: {
  block: any;
}) {
  const content = block.content ?? {};

  return (
    <div className="space-y-3">
      <div>
        <p className="mb-1 text-xs font-medium text-slate-500">
          Text
        </p>

        <p className="text-sm font-medium text-slate-900">
          {content.text}
        </p>
      </div>

      <div>
        <p className="mb-1 text-xs font-medium text-slate-500">
          URL
        </p>

        <a
          href={content.url}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-sm text-blue-600 hover:underline"
        >
          {content.url}
        </a>
      </div>
    </div>
  );
}

export default function LinkDiff({
  from,
  to,
}: Props) {
  if (!to) {
    return <LinkContent block={from} />;
  }

  const oldContent = from.content ?? {};
  const newContent = to.content ?? {};

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
            from={String(oldContent.text ?? "")}
            to={String(newContent.text ?? "")}
          />
        </div>
      ) : (
        <div>
          <p className="mb-1 text-xs font-medium text-slate-500">
            Text
          </p>

          <p className="text-sm text-slate-700">
            {oldContent.text}
          </p>
        </div>
      )}

      {urlChanged ? (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
            URL
          </p>

          <TextDiff
            from={String(oldContent.url ?? "")}
            to={String(newContent.url ?? "")}
          />
        </div>
      ) : (
        <div>
          <p className="mb-1 text-xs font-medium text-slate-500">
            URL
          </p>

          <a
            href={oldContent.url}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-sm text-blue-600 hover:underline"
          >
            {oldContent.url}
          </a>
        </div>
      )}
    </div>
  );
}