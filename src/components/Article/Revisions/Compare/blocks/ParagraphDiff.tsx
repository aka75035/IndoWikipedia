import TextDiff from "./TextDiff";

type Props = {
  from: any;
  to?: any;
};

export default function ParagraphDiff({
  from,
  to,
}: Props) {
  if (!to) {
    return (
      <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
        {from.content}
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