export const SCRAPED_ARTICLE_REPOSITORY = 'SCRAPED_ARTICLE_REPOSITORY';

export interface CreateScrapedArticleInput {
  portal: string;
  url: string;
  title: string;
  body: string;
  guid?: string;
  imageUrl?: string;
}

export interface ScrapedArticleRepository {
  findAll(): Promise<any[]>;
  findByUrl(url: string): Promise<any | null>;
  findByGuid(guid: string): Promise<any | null>;
  findUnprocessed(): Promise<any[]>;
  create(data: CreateScrapedArticleInput): Promise<any>;
  markProcessed(id: string, summary: string, contentId: string): Promise<any>;
  markError(id: string, error: string): Promise<any>;
}
