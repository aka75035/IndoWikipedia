import type {
  CodeBlockContent,
} from "@/types/article-editor";

type Props = {
  content: CodeBlockContent;
};

export default function CodeBlock({
  content,
}: Props) {
  return (
    <figure className="my-8 max-w-4xl overflow-hidden border border-slate-800 bg-slate-950">
      {content.language && (
        <figcaption className="border-b border-slate-800 px-4 py-2 text-xs font-medium uppercase tracking-wider text-slate-400">
          {content.language}
        </figcaption>
      )}

      <pre className="overflow-x-auto p-5 text-sm leading-6 text-slate-200">
        <code>{content.code}</code>
      </pre>
    </figure>
  );
}