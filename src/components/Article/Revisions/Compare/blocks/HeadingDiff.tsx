import TextDiff from "./TextDiff";

import type { RevisionBlock } from "@/types/article-diff";

type Props = {
  from: RevisionBlock;
  to?: RevisionBlock;
};

export default function HeadingDiff({
  from,
  to,
}: Props) {
  if (!to) {
    return (
      <h4 className="text-lg font-semibold text-slate-900">
        {String(from.content ?? "")}
      </h4>
    );
  }

  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase text-slate-500">
        Heading changed
      </p>

      <TextDiff
        from={String(from.content ?? "")}
        to={String(to.content ?? "")}
      />
    </div>
  );
}