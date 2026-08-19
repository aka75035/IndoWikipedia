import type {
  OrderedListBlockContent,
} from "@/types/article-editor";

type Props = {
  content: OrderedListBlockContent;
};

export default function OrderedListBlock({
  content,
}: Props) {
  return (
    <ol className="my-6 max-w-4xl list-decimal space-y-2 pl-7 text-[1.0625rem] leading-7 text-slate-700 marker:text-slate-500">
      {content.items.map((item, index) => (
        <li key={`${index}-${item}`}>
          {item}
        </li>
      ))}
    </ol>
  );
}