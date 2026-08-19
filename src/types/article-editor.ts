export type ParagraphBlockContent = string;

export type HeadingBlockContent = string;

export type ImageBlockContent = {
  url: string;
  alt: string;
  caption?: string;
};

export type GalleryBlockContent = {
  images: {
    url: string;
    alt: string;
    caption?: string;
  }[];
};

export type VideoBlockContent = {
  url: string;
  title?: string;
  caption?: string;
};

export type QuoteBlockContent = {
  text: string;
  author?: string;
  source?: string;
};

export type ListBlockContent = {
  items: string[];
};

export type OrderedListBlockContent = {
  items: string[];
};

export type TableBlockContent = {
  headers: string[];
  rows: string[][];
};

export type CodeBlockContent = {
  code: string;
  language: string;
};

export type MathBlockContent = {
  expression: string;
};

export type ReferenceBlockContent = {
  title: string;
  url: string;
  publisher?: string;
  author?: string;
};

export type LinkBlockContent = {
  url: string;
  label: string;
};

export type InfoboxBlockContent = {
  title: string;
  image?: string | null;
  fields: {
    label: string;
    value: string;
    order: number;
  }[];
};

export type ArticleEditorBlock =
  | {
      type: "paragraph";
      content: ParagraphBlockContent;
      order: number;
    }
  | {
      type: "heading";
      content: HeadingBlockContent;
      order: number;
    }
  | {
      type: "image";
      content: ImageBlockContent;
      order: number;
    }
  | {
      type: "gallery";
      content: GalleryBlockContent;
      order: number;
    }
  | {
      type: "video";
      content: VideoBlockContent;
      order: number;
    }
  | {
      type: "quote";
      content: QuoteBlockContent;
      order: number;
    }
  | {
      type: "list";
      content: ListBlockContent;
      order: number;
    }
  | {
      type: "ordered-list";
      content: OrderedListBlockContent;
      order: number;
    }
  | {
      type: "table";
      content: TableBlockContent;
      order: number;
    }
  | {
      type: "code";
      content: CodeBlockContent;
      order: number;
    }
  | {
      type: "math";
      content: MathBlockContent;
      order: number;
    }
  | {
      type: "reference";
      content: ReferenceBlockContent;
      order: number;
    }
  | {
      type: "link";
      content: LinkBlockContent;
      order: number;
    }
  | {
      type: "infobox";
      content: InfoboxBlockContent;
      order: number;
    };

export type ArticleEditorSection = {
  title: string;
  level: number;
  blocks: ArticleEditorBlock[];
  order: number;
};

export type ArticleEditorCategory = {
  _id: string;
  name: string;
  slug: string;
};

export type ArticleEditorReference = {
  _id?: string;
  title: string;
  url: string;
  publisher?: string;
  author?: string;
  publishedAt?: string;
  accessedAt?: string;
  description?: string;
};

export type ArticleEditorInfoboxField = {
  label: string;
  value: string;
  order: number;
};

export type ArticleEditorInfobox = {
  title: string;
  image?: string | null;
  fields: ArticleEditorInfoboxField[];
};

export type ArticleEditorProps = {
  articleId: string;
  revisionId: string;
  slug: string;
  title: string;
  summary: string;
  categories: ArticleEditorCategory[];
  availableCategories: ArticleEditorCategory[];
  sections: ArticleEditorSection[];
  infobox: ArticleEditorInfobox | null;
  references: ArticleEditorReference[];
  editSummary: string;
};