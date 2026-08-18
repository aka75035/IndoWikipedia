export type ArticleEditorBlock = {
  type: "paragraph" | "heading";
  content: unknown;
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

export type ArticleEditorProps = {
  articleId: string;
  revisionId: string;
  title: string;
  summary: string;
  categories: ArticleEditorCategory[];
  sections: ArticleEditorSection[];
};