import TextDiff from "./TextDiff";

import type { RevisionBlock } from "@/types/article-diff";

type Props = {
  from: RevisionBlock;
  to?: RevisionBlock;
};

export default function QuoteDiff({
  from,
  to,
}: Props) {
  if (!to) {
    return (
      <blockquote className="border-l-4 border-slate-300 pl-4 text-sm italic leading-7 text-slate-700">
        {String(from.content ?? "")}
      </blockquote>
    );
  }

  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase text-slate-500">
        Quote changed
      </p>

      <TextDiff
        from={String(from.content ?? "")}
        to={String(to.content ?? "")}
      />
    </div>
  );
}