import type {
  CodeContent,
  RevisionBlock,
} from "@/types/article-diff";

type CodeBlock = RevisionBlock & {
  content: CodeContent;
};

type Props = {
  from: RevisionBlock;
  to?: RevisionBlock;
};

function getCodeContent(
  content: unknown
): CodeContent {
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
    code:
      typeof value.code === "string"
        ? value.code
        : undefined,
    language:
      typeof value.language === "string"
        ? value.language
        : undefined,
  };
}

function CodeBlock({
  code,
  language,
  type,
}: {
  code: string;
  language?: string;
  type?: "added" | "removed";
}) {
  const className =
    type === "added"
      ? "border-green-200 bg-green-50 text-green-900"
      : type === "removed"
        ? "border-red-200 bg-red-50 text-red-900"
        : "border-slate-200 bg-slate-50 text-slate-800";

  return (
    <div
      className={`overflow-hidden rounded-lg border ${className}`}
    >
      {language && (
        <div className="border-b border-inherit px-3 py-2 text-xs font-semibold uppercase tracking-wide opacity-70">
          {language}
        </div>
      )}

      <pre className="overflow-x-auto p-4 text-sm leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function normalize(value: unknown) {
  return String(value ?? "").replace(
    /\r\n/g,
    "\n"
  );
}

function getLines(code: string) {
  return normalize(code).split("\n");
}

export default function CodeDiff({
  from,
  to,
}: Props) {
  const oldContent = getCodeContent(from?.content);
  const newContent = to ? getCodeContent(to.content) : {};

  /*
   * Removed code block.
   */
  if (!to) {
    return (
      <div className="space-y-3">
        <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
          Removed
        </span>

        <CodeBlock
          code={oldContent.code ?? ""}
          language={oldContent.language}
          type="removed"
        />
      </div>
    );
  }

  /*
   * Added code block.
   */
  if (!from) {
    return (
      <div className="space-y-3">
        <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
          Added
        </span>

        <CodeBlock
          code={newContent.code ?? ""}
          language={newContent.language}
          type="added"
        />
      </div>
    );
  }

  const oldCode =
    oldContent.code ?? "";

  const newCode =
    newContent.code ?? "";

  const oldLanguage =
    oldContent.language ?? "";

  const newLanguage =
    newContent.language ?? "";

  const languageChanged =
    oldLanguage !== newLanguage;

  const codeChanged =
    normalize(oldCode) !==
    normalize(newCode);

  /*
   * Nothing changed.
   */
  if (
    !languageChanged &&
    !codeChanged
  ) {
    return (
      <CodeBlock
        code={oldCode}
        language={oldLanguage}
      />
    );
  }

  const oldLines = getLines(oldCode);
  const newLines = getLines(newCode);

  const maxLines = Math.max(
    oldLines.length,
    newLines.length
  );

  /*
   * Simple line-by-line diff.
   *
   * This intentionally keeps the component
   * lightweight. More advanced diff matching
   * can be added later without changing the
   * component API.
   */
  const lineChanges = [];

  for (
    let index = 0;
    index < maxLines;
    index++
  ) {
    const oldLine =
      oldLines[index];

    const newLine =
      newLines[index];

    if (
      oldLine === undefined &&
      newLine !== undefined
    ) {
      lineChanges.push({
        type: "added",
        value: newLine,
        index,
      });

      continue;
    }

    if (
      oldLine !== undefined &&
      newLine === undefined
    ) {
      lineChanges.push({
        type: "removed",
        value: oldLine,
        index,
      });

      continue;
    }

    if (oldLine !== newLine) {
      lineChanges.push({
        type: "removed",
        value: oldLine,
        index,
      });

      lineChanges.push({
        type: "added",
        value: newLine,
        index,
      });

      continue;
    }

    lineChanges.push({
      type: "same",
      value: oldLine,
      index,
    });
  }

  return (
    <div className="space-y-5">
      {languageChanged && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-blue-700">
            Language changed
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded bg-red-100 px-3 py-2 text-sm text-red-900">
              {oldLanguage || "None"}
            </div>

            <div className="rounded bg-green-100 px-3 py-2 text-sm text-green-900">
              {newLanguage || "None"}
            </div>
          </div>
        </div>
      )}

      {codeChanged && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-blue-700">
            Code changes
          </p>

          <div className="overflow-hidden rounded-lg border border-slate-200">
            <pre className="overflow-x-auto text-sm leading-6">
              {lineChanges.map(
                (line, index) => (
                  <div
                    key={`${line.index}-${index}`}
                    className={
                      line.type ===
                      "added"
                        ? "bg-green-50 px-4 text-green-900"
                        : line.type ===
                            "removed"
                          ? "bg-red-50 px-4 text-red-900"
                          : "bg-white px-4 text-slate-700"
                    }
                  >
                    <span className="mr-4 inline-block w-4 select-none text-right text-xs opacity-50">
                      {line.type ===
                      "added"
                        ? "+"
                        : line.type ===
                            "removed"
                          ? "-"
                          : " "}
                    </span>

                    {line.value}
                  </div>
                )
              )}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}