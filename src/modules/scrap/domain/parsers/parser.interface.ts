export interface ParsedArticle {
  title: string;
  url: string;
  body: string;
  sourceName: string;
  guid?: string;
  imageUrl?: string;
}

export interface ParsedArticleWithSummary extends ParsedArticle {
  summary?: string | null;
  translatedTitle?: string | null;
  translatedText?: string | null;
  categorySlug?: string | null;
  tags?: string[];
  contentId?: string | null;
}

export interface ContentParser {
  parse(html: string, sourceName: string): Promise<ParsedArticle[]>;
}
