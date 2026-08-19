import type {
  MathBlockContent,
} from "@/types/article-editor";

type Props = {
  content: MathBlockContent;
};

export default function MathBlock({
  content,
}: Props) {
  return (
    <div className="my-8 max-w-4xl overflow-x-auto border-y border-slate-200 bg-slate-50 px-5 py-6">
      <code className="whitespace-pre text-base leading-8 text-slate-800">
        {content.expression}
      </code>
    </div>
  );
}