type Props = {
  content: string;
};

export default function ParagraphBlock({
  content,
}: Props) {
  return (
    <p className="max-w-4xl text-[1.0625rem] leading-8 text-slate-700">
      {content}
    </p>
  );
}