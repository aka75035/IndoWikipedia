import type {
  LinkBlockContent,
} from "@/types/article-editor";

type Props = {
  content: LinkBlockContent;
};

export default function LinkBlock({
  content,
}: Props) {
  return (
    <p className="my-5 max-w-4xl text-[1.0625rem] leading-8">
      <a
        href={content.url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-blue-700 underline decoration-blue-200 underline-offset-2 transition-colors hover:text-blue-900 hover:decoration-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        {content.label}
      </a>
    </p>
  );
}