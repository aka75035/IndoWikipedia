import type {
  QuoteBlockContent,
} from "@/types/article-editor";

type Props = {
  content: QuoteBlockContent;
};

export default function QuoteBlock({
  content,
}: Props) {
  return (
    <blockquote className="my-8 max-w-4xl border-l-4 border-slate-300 pl-5 sm:pl-6">
      <p className="text-lg leading-8 text-slate-700">
        “{content.text}”
      </p>

      {(content.author || content.source) && (
        <footer className="mt-3 text-sm leading-6 text-slate-500">
          {content.author && (
            <span className="font-medium text-slate-700">
              {content.author}
            </span>
          )}

          {content.source && (
            <span>
              {content.author ? ", " : ""}
              {content.source}
            </span>
          )}
        </footer>
      )}
    </blockquote>
  );
}