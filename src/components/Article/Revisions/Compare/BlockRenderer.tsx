import ParagraphDiff from "./blocks/ParagraphDiff";
import HeadingDiff from "./blocks/HeadingDiff";
import QuoteDiff from "./blocks/QuoteDiff";
import ImageDiff from "./blocks/ImageDiff";
import VideoDiff from "./blocks/VideoDiff";
import LinkDiff from "./blocks/LinkDiff";
import ListDiff from "./blocks/ListDiff";
import TableDiff from "./blocks/TableDiff";
import CodeDiff from "./blocks/CodeDiff";
import MathDiff from "./blocks/MathDiff";

import type { RevisionBlock } from "@/types/article-diff";

type Props = { 
  block: RevisionBlock;
  compareWith?: RevisionBlock;
};

export default function BlockRenderer({
  block,
  compareWith,
}: Props) {
  if (!block) {
    return null;
  }

  /**
   * The block type itself changed.
   *
   * Example:
   * video -> paragraph
   */
  if (
    compareWith &&
    block.type !== compareWith.type
  ) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {/* Previous block */}
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="mb-3 text-xs font-semibold uppercase text-red-600">
            Previous · {block.type}
          </p>

          <BlockRenderer block={block} />
        </div>

        {/* New block */}
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="mb-3 text-xs font-semibold uppercase text-green-600">
            New · {compareWith.type}
          </p>

          <BlockRenderer
            block={compareWith}
          />
        </div>
      </div>
    );
  }

  /**
   * Same block type.
   *
   * Let the specific diff component
   * compare the old and new content.
   */
  switch (block.type) {
    case "paragraph":
      return (
        <ParagraphDiff
          from={block}
          to={compareWith}
        />
      );

    case "heading":
      return (
        <HeadingDiff
          from={block}
          to={compareWith}
        />
      );

    case "quote":
      return (
        <QuoteDiff
          from={block}
          to={compareWith}
        />
      );

    case "image":
      return (
        <ImageDiff
          from={block}
          to={compareWith}
        />
      );

    case "video":
      return (
        <VideoDiff
          from={block}
          to={compareWith}
        />
      );

    case "link":
      return (
        <LinkDiff
          from={block}
          to={compareWith}
        />
      );

    case "list":
    case "ordered-list":
      return (
        <ListDiff
          from={block}
          to={compareWith}
        />
      );

    case "table":
      return (
        <TableDiff
          from={block}
          to={compareWith}
        />
      );

    case "code":
      return (
        <CodeDiff
          from={block}
          to={compareWith}
        />
      );

    case "math":
      return (
        <MathDiff
          from={block}
          to={compareWith}
        />
      );

    default:
      return (
        <div className="rounded-lg bg-slate-100 p-3 text-sm text-slate-500">
          Unsupported block type:

          <span className="ml-1 font-medium">
            {block.type}
          </span>
        </div>
      );
  }
}