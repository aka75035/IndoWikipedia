import type {
  ImageBlockContent,
} from "@/types/article-editor";
import Image from "next/image";

type Props = {
  content: ImageBlockContent;
};

export default function ImageBlock({
  content,
}: Props) {
  return (
    <figure className="my-4 w-full sm:float-right sm:ml-6 sm:w-[260px] md:w-[280px] lg:w-[300px]">
      <div className="border border-slate-200 bg-slate-50 p-1">
        <Image
          src={content.url}
          alt={content.alt ?? ""}
          width={800}
          height={450}
          className="h-auto max-h-[400px] w-full object-contain"
        />
      </div>

      {content.caption && (
        <figcaption className="mt-2 text-xs leading-5 text-slate-500">
          {content.caption}
        </figcaption>
      )}
    </figure>
  );
}