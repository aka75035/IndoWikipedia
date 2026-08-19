type Props = {
  from: string;
  to: string;
};

type Token = {
  text: string;
  type: "same" | "removed" | "added";
};

function tokenize(text: string): string[] {
  return text.match(/\s+|[^\s]+/g) ?? [];
}

function createDiff(
  oldTokens: string[],
  newTokens: string[]
): {
  oldResult: Token[];
  newResult: Token[];
} {
  const rows = oldTokens.length + 1;
  const columns = newTokens.length + 1;

  const matrix = Array.from(
    { length: rows },
    () => Array<number>(columns).fill(0)
  );
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < columns; j++) {
      if (
        oldTokens[i - 1] ===
        newTokens[j - 1]
      ) {
        matrix[i][j] =
          matrix[i - 1][j - 1] + 1;
      } else {
        matrix[i][j] = Math.max(
          matrix[i - 1][j],
          matrix[i][j - 1]
        );
      }
    }
  }

  const oldResult: Token[] = [];
  const newResult: Token[] = [];

  let i = oldTokens.length;
  let j = newTokens.length;

  while (i > 0 || j > 0) {
    if (
      i > 0 &&
      j > 0 &&
      oldTokens[i - 1] ===
        newTokens[j - 1]
    ) {
      oldResult.unshift({
        text: oldTokens[i - 1],
        type: "same",
      });

      newResult.unshift({
        text: newTokens[j - 1],
        type: "same",
      });

      i--;
      j--;

      continue;
    }

    if (
      i > 0 &&
      (j === 0 ||
        matrix[i - 1][j] >=
          matrix[i][j - 1])
    ) {
      oldResult.unshift({
        text: oldTokens[i - 1],
        type: "removed",
      });

      i--;

      continue;
    }

    if (j > 0) {
      newResult.unshift({
        text: newTokens[j - 1],
        type: "added",
      });

      j--;
    }
  }

  return {
    oldResult,
    newResult,
  };
}

function renderTokens(tokens: Token[]) {
  return tokens.map(
    (token, index) => {
      if (token.type === "removed") {
        return (
          <span
            key={index}
            className="rounded bg-red-200 px-0.5 text-red-900 line-through"
          >
            {token.text}
          </span>
        );
      }

      if (token.type === "added") {
        return (
          <span
            key={index}
            className="rounded bg-green-200 px-0.5 text-green-900"
          >
            {token.text}
          </span>
        );
      }

      return (
        <span key={index}>
          {token.text}
        </span>
      );
    }
  );
}

export default function TextDiff({
  from,
  to,
}: Props) {
  const oldTokens = tokenize(from);
  const newTokens = tokenize(to);

  const {
    oldResult,
    newResult,
  } = createDiff(
    oldTokens,
    newTokens
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="mb-3 text-xs font-semibold uppercase text-red-600">
          Previous
        </p>

        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
          {renderTokens(oldResult)}
        </p>
      </div>

      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <p className="mb-3 text-xs font-semibold uppercase text-green-600">
          New
        </p>

        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
          {renderTokens(newResult)}
        </p>
      </div>
    </div>
  );
}