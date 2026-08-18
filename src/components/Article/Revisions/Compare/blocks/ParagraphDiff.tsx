import TextDiff from "./TextDiff";

import type { RevisionBlock } from "@/types/article-diff";

type Props = {
  from: RevisionBlock;
  to?: RevisionBlock;
};

export default function ParagraphDiff({
  from,
  to,
}: Props) {
  if (!to) {
    return (
      <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
        {String(from.content ?? "")}
      </p>
    );
  }

  return (
    <TextDiff
      from={String(from.content ?? "")}
      to={String(to.content ?? "")}
    />
  );
}