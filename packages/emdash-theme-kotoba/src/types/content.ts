export type ContentMetadata = {
  likes: number;
  views: number;
  comments: number;
};

export type ThemePost = {
  id: string;
  contentId: string;
  title: string;
  excerpt: string;
  content: unknown;
  slug: string;
  permalink: string;
  publishedAt: Date | null;
  updatedAt: Date | null;
  visible: boolean;
  category?: string;
  tags: string[];
  cover?: string;
};

export type ThemePage = {
  id: string;
  contentId: string;
  title: string;
  content: unknown;
  slug: string;
  permalink: string;
  publishedAt: Date | null;
};

export type ThemeTaxonomy = {
  id: string;
  slug: string;
  label: string;
  count: number;
  permalink: string;
};

export type ThemePostWithMetadata = ThemePost & {
  meta: ContentMetadata;
};
