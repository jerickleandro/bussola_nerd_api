import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SCRAPED_ARTICLE_REPOSITORY } from './domain/interfaces/scraped-article.repository.interface';
import type { ScrapedArticleRepository } from './domain/interfaces/scraped-article.repository.interface';
import { CONTENTS_REPOSITORY } from '../contents/domain/interfaces/contents.repository.interface';
import type { ContentsRepository } from '../contents/domain/interfaces/contents.repository.interface';
import { LLM_PROVIDER } from '../../shared/providers/llm/llm.provider.interface';
import type { LlmProvider } from '../../shared/providers/llm/llm.provider.interface';
import { ParserFactory } from './domain/parsers/parser.factory';
import type {
  ParsedArticle,
  ParsedArticleWithSummary,
} from './domain/parsers/parser.interface';
import { ScrapPortal } from '../../config/scrap.config';
import { CategoriesService } from '../categories/domain/categories.service';

interface FetchedArticle {
  article: ParsedArticle;
  scrapedArticleId: string;
}

@Injectable()
export class ScrapService {
  private readonly logger = new Logger(ScrapService.name);
  private readonly portals: ScrapPortal[];
  private readonly tagTopics: string[];

  constructor(
    @Inject(SCRAPED_ARTICLE_REPOSITORY)
    private readonly scrapedArticleRepository: ScrapedArticleRepository,
    @Inject(CONTENTS_REPOSITORY)
    private readonly contentsRepository: ContentsRepository,
    @Inject(LLM_PROVIDER)
    private readonly llmProvider: LlmProvider,
    private readonly configService: ConfigService,
    private readonly categoriesService: CategoriesService,
  ) {
    const scrapConfig = this.configService.get('scrap');
    this.portals = scrapConfig.portals ?? [];
    this.tagTopics = scrapConfig.tagTopics ?? [];
  }

  async run(): Promise<ParsedArticleWithSummary[]> {
    this.logger.log('Starting scrap pipeline...');

    const categories = await this.getArticleCategories();
    const results: ParsedArticleWithSummary[] = [];

    for (const portal of this.portals) {
      try {
        const articles = await this.fetchPortal(portal);
        for (const item of articles) {
          const processed = await this.processArticle(item, categories);
          if (processed) {
            results.push(processed);
          }
        }
      } catch (error) {
        this.logger.error(
          `Error fetching portal ${portal.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    }

    this.logger.log(
      `Scrap pipeline completed: ${results.length} articles saved`,
    );
    return results;
  }

  private async getArticleCategories(): Promise<
    { id: string; name: string; slug: string }[]
  > {
    const categories = await this.categoriesService.findAll();
    return (categories ?? [])
      .filter(
        (c: any) =>
          c.isActive !== false && !String(c.slug ?? '').startsWith('podcast-'),
      )
      .map((c: any) => ({
        id: c._id.toString(),
        name: c.name,
        slug: c.slug,
      }));
  }

  private async fetchPortal(portal: ScrapPortal): Promise<FetchedArticle[]> {
    this.logger.log(`Fetching portal: ${portal.name}`);

    const response = await fetch(portal.url, {
      headers: {
        'User-Agent': 'BussolaNerdBot/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} fetching ${portal.url}`);
    }

    const content = await response.text();
    const parser = ParserFactory.create(portal.type);
    const articles = await parser.parse(content, portal.name);

    this.logger.log(`Fetched ${articles.length} articles from ${portal.name}`);

    const newArticles: FetchedArticle[] = [];

    for (const article of articles) {
      if (!article.body?.trim()) {
        continue;
      }

      const existing = article.guid
        ? ((await this.scrapedArticleRepository.findByGuid(article.guid)) ??
          (await this.scrapedArticleRepository.findByUrl(article.url)))
        : await this.scrapedArticleRepository.findByUrl(article.url);

      if (existing) {
        continue;
      }

      const saved = await this.scrapedArticleRepository.create({
        portal: portal.name,
        url: article.url,
        title: article.title,
        body: article.body,
        guid: article.guid,
        imageUrl: article.imageUrl,
      });

      newArticles.push({
        article,
        scrapedArticleId: saved._id.toString(),
      });
    }

    return newArticles;
  }

  private async processArticle(
    item: FetchedArticle,
    categories: { id: string; name: string; slug: string }[],
  ): Promise<ParsedArticleWithSummary | null> {
    const { article, scrapedArticleId } = item;

    try {
      const result = await this.llmProvider.translateAndSummarize({
        originalText: article.body,
        title: article.title,
        sourceLanguage: 'en',
        targetLanguage: 'pt-BR',
        maxSummaryChars: 600,
        categories,
        tagTopics: this.tagTopics,
      });

      const categoryId = this.resolveCategoryId(
        result.categorySlug,
        categories,
      );
      const slug = await this.generateUniqueSlug(result.translatedTitle);
      const tags = this.resolveTags(result.tags, this.tagTopics);

      const content = await this.contentsRepository.create({
        type: 'NEWS',
        title: result.translatedTitle,
        slug,
        summary: result.summary,
        body: result.translatedText.slice(0, 1000),
        coverImageUrl: article.imageUrl,
        categoryId,
        tags,
        isCurated: false,
        originalSourceUrl: article.url,
        originalSourceName: article.sourceName,
        status: 'PUBLISHED',
        publishedAt: new Date(),
      });

      await this.scrapedArticleRepository.markProcessed(
        scrapedArticleId,
        result.summary,
        content._id?.toString() ?? '',
      );

      this.logger.log(`Article saved: ${result.translatedTitle}`);

      return {
        ...article,
        summary: result.summary,
        translatedTitle: result.translatedTitle,
        translatedText: result.translatedText,
        categorySlug: result.categorySlug,
        tags,
        contentId: content._id?.toString() ?? null,
      };
    } catch (error) {
      this.logger.error(
        `Error processing article ${article.title}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      await this.scrapedArticleRepository.markError(
        scrapedArticleId,
        error instanceof Error ? error.message : 'Unknown error',
      );
      return null;
    }
  }

  private resolveCategoryId(
    categorySlug: string | undefined,
    categories: { id: string; name: string; slug: string }[],
  ): string | undefined {
    if (!categorySlug) {
      return undefined;
    }
    const normalized = categorySlug.trim().toLowerCase();
    const match = categories.find(
      (c) =>
        c.slug.toLowerCase() === normalized ||
        c.name.toLowerCase() === normalized,
    );
    return match?.id;
  }

  private resolveTags(
    tags: string[] | undefined,
    tagTopics: string[],
  ): string[] {
    if (!Array.isArray(tags) || tags.length === 0) {
      return [];
    }
    const valid = tagTopics.map((t) => t.toLowerCase());
    return tags
      .map((t) => t.trim())
      .filter((t) => valid.includes(t.toLowerCase()))
      .slice(0, 5);
  }

  private async generateUniqueSlug(title: string): Promise<string> {
    const base = this.generateSlug(title);
    if (await this.contentsRepository.findBySlug(base)) {
      return `${base}-${Date.now()}`;
    }
    return base;
  }

  private generateSlug(title: string): string {
    return title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
}
