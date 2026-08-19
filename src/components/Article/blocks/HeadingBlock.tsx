type Props = {
  content: string;
};

export default function HeadingBlock({
  content,
}: Props) {
  return (
    <h3 className="mt-10 max-w-4xl border-b border-slate-200 pb-2 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
      {content}
    </h3>
  );
}