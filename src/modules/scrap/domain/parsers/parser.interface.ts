export interface ParsedArticle {
  title: string;
  url: string;
  body: string;
  sourceName: string;
  guid?: string;
  imageUrl?: string;
}

export interface ContentParser {
  parse(html: string, sourceName: string): Promise<ParsedArticle[]>;
}
