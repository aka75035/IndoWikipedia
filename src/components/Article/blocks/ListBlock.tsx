import type {
  ListBlockContent,
} from "@/types/article-editor";

type Props = {
  content: ListBlockContent;
};

export default function ListBlock({
  content,
}: Props) {
  return (
    <ul className="my-6 max-w-4xl list-disc space-y-2 pl-7 text-[1.0625rem] leading-7 text-slate-700 marker:text-slate-500">
      {content.items.map((item, index) => (
        <li key={`${index}-${item}`}>
          {item}
        </li>
      ))}
    </ul>
  );
}