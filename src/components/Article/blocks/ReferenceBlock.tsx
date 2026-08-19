import type {
  ReferenceBlockContent,
} from "@/types/article-editor";

type Props = {
  content: ReferenceBlockContent;
};

export default function ReferenceBlock({
  content,
}: Props) {
  return (
    <div className="my-5 max-w-4xl border-l-2 border-slate-300 pl-4 text-sm leading-6">
      <a
        href={content.url}
        target="_blank"
        rel="noopener noreferrer"
        className="break-words font-medium text-blue-700 underline decoration-blue-200 underline-offset-2 hover:text-blue-900 hover:decoration-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        {content.title}
      </a>

      {(content.author || content.publisher) && (
        <p className="mt-1 text-slate-500">
          {content.author}

          {content.author &&
            content.publisher &&
            " · "}

          {content.publisher}
        </p>
      )}
    </div>
  );
}