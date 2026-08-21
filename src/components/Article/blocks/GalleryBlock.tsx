import type {
  GalleryBlockContent,
} from "@/types/article-editor";
import Image from "next/image";

type Props = {
  content: GalleryBlockContent;
};

export default function GalleryBlock({
  content,
}: Props) {
  if (content.images.length === 0) {
    return null;
  }

  return (
    <div className="my-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {content.images.map((image, index) => (
        <figure
          key={`${image.url}-${index}`}
          className="min-w-0"
        >
          <div className="overflow-hidden bg-slate-50">
            <Image
              src={image.url}
              alt={image.alt}
              width={800}
              height={450}
              className="aspect-[4/3] w-full object-cover transition-transform duration-200 hover:scale-[1.02]"
            />
          </div>

          {image.caption && (
            <figcaption className="mt-2 text-sm leading-5 text-slate-500">
              {image.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}