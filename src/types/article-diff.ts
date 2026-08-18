export type BlockType =
  | "paragraph"
  | "heading"
  | "quote"
  | "image"
  | "video"
  | "link"
  | "code"
  | "table"
  | "list"
  | "ordered-list"
  | "math";

export type RevisionBlock = {
  _id?: string;
  type: BlockType;
  content: unknown;
  order?: number;
};

export type BlockChange = {
  order: number;
  from: RevisionBlock;
  to: RevisionBlock;
};

export type BlockChanges = {
  added: RevisionBlock[];
  removed: RevisionBlock[];
  modified: BlockChange[];
};

export type Section = {
  _id?: string;
  title: string;
  level?: number;
  order?: number;
  blocks?: RevisionBlock[];
  [key: string]: unknown;
};

export type SectionChange = {
  title: string;
  from: Section;
  to: Section;
  blocks: {
    added: RevisionBlock[];
    removed: RevisionBlock[];
    modified: BlockChange[];
  };
};

export type SectionChanges = {
  added: Section[];
  removed: Section[];
  modified: SectionChange[];
};


export type SimpleArrayChanges = {
  added: unknown[];
  removed: unknown[];
  modified: unknown[];
};

export type RevisionComparison = {
  title: {
    changed: boolean;
    from: unknown;
    to: unknown;
  };

  summary: {
    changed: boolean;
    from: unknown;
    to: unknown;
  };

  infobox: {
    changed: boolean;
    [key: string]: unknown;
  };

  sections: SectionChanges;

  references: ReferenceChanges;

  categories: SimpleArrayChanges;

  media: SimpleArrayChanges;
};

export type InfoboxField = {
  _id?: string;
  label?: string;
  value?: unknown;
  order?: number;
};

export type InfoboxFieldChange = {
  from: InfoboxField;
  to: InfoboxField;
};

export type InfoboxData = {
  title?: unknown;
  image?: unknown;
  fields: InfoboxField[];
  [key: string]: unknown;
};

export type InfoboxChanges = {
  changed: boolean;

  added?: InfoboxData;
  removed?: InfoboxData;

  title?: {
    changed: boolean;
    from: unknown;
    to: unknown;
  };

  image?: {
    changed: boolean;
    from: unknown;
    to: unknown;
  };

  fields?: {
    added: InfoboxField[];
    removed: InfoboxField[];
    modified: InfoboxFieldChange[];
  };
};

export type ArticleReference = {
  _id?: string;
  title?: string;
  url?: string;
  publisher?: string;
  accessedAt?: string | Date;
  description?: string;
};

export type ReferenceChange = {
  from: ArticleReference;
  to: ArticleReference;
};

export type ReferenceChanges = {
  added?: ArticleReference[];
  removed?: ArticleReference[];
  modified?: ReferenceChange[];
};

export type ImageContent = {
  url?: string;
  caption?: string;
  alt?: string;
};

export type CodeContent = {
  code?: string;
  language?: string;
};

export type LinkContent = {
  text?: string;
  url?: string;
};

export type ListContent = string[];

export type VideoContent = {
  url?: string;
  alt?: string;
  caption?: string;
};