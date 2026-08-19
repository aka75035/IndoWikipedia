import type {
  ArticleEditorBlock,
} from "@/types/article-editor";

import ParagraphBlock from "./ParagraphBlock";
import HeadingBlock from "./HeadingBlock";
import ImageBlock from "./ImageBlock";
import GalleryBlock from "./GalleryBlock";
import VideoBlock from "./VideoBlock";
import QuoteBlock from "./QuoteBlock";
import ListBlock from "./ListBlock";
import OrderedListBlock from "./OrderedListBlock";
import TableBlock from "./TableBlock";
import CodeBlock from "./CodeBlock";
import MathBlock from "./MathBlock";
import ReferenceBlock from "./ReferenceBlock";
import LinkBlock from "./LinkBlock";
import InfoboxBlock from "./InfoboxBlock";

type Props = {
  block: ArticleEditorBlock;
};

export default function ArticleBlockRenderer({
  block,
}: Props) {
  switch (block.type) {
    case "paragraph":
      return (
        <ParagraphBlock
          content={block.content}
        />
      );

    case "heading":
      return (
        <HeadingBlock
          content={block.content}
        />
      );

    case "image":
      return (
        <ImageBlock
          content={block.content}
        />
      );

    case "gallery":
      return (
        <GalleryBlock
          content={block.content}
        />
      );

    case "video":
      return (
        <VideoBlock
          content={block.content}
        />
      );

    case "quote":
      return (
        <QuoteBlock
          content={block.content}
        />
      );

    case "list":
      return (
        <ListBlock
          content={block.content}
        />
      );

    case "ordered-list":
      return (
        <OrderedListBlock
          content={block.content}
        />
      );

    case "table":
      return (
        <TableBlock
          content={block.content}
        />
      );

    case "code":
      return (
        <CodeBlock
          content={block.content}
        />
      );

    case "math":
      return (
        <MathBlock
          content={block.content}
        />
      );

    case "reference":
      return (
        <ReferenceBlock
          content={block.content}
        />
      );

    case "link":
      return (
        <LinkBlock
          content={block.content}
        />
      );

    case "infobox":
      return (
        <InfoboxBlock
          content={block.content}
        />
      );

    default:
      return null;
  }
}