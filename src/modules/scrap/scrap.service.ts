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

@Injectable()
export class ScrapService {
  private readonly logger = new Logger(ScrapService.name);
  private readonly portals: ScrapPortal[];

  constructor(
    @Inject(SCRAPED_ARTICLE_REPOSITORY)
    private readonly scrapedArticleRepository: ScrapedArticleRepository,
    @Inject(CONTENTS_REPOSITORY)
    private readonly contentsRepository: ContentsRepository,
    @Inject(LLM_PROVIDER)
    private readonly llmProvider: LlmProvider,
    private readonly configService: ConfigService,
  ) {
    const scrapConfig = this.configService.get('scrap');
    this.portals = scrapConfig.portals ?? [];
  }

  async run(): Promise<ParsedArticleWithSummary[]> {
    this.logger.log('Starting scrap pipeline...');

    const fetchedArticles: ParsedArticle[] = [];

    for (const portal of this.portals) {
      try {
        const articles = await this.fetchPortal(portal);
        fetchedArticles.push(...articles);
      } catch (error) {
        this.logger.error(
          `Error fetching portal ${portal.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    }

    const summarized: ParsedArticleWithSummary[] = [];
    for (const article of fetchedArticles) {
      const enrichment = await this.enrichArticle(article);
      summarized.push({ ...article, ...enrichment });
    }

    this.logger.log(
      `Scrap pipeline completed: ${fetchedArticles.length} articles fetched, ${summarized.filter((a) => a.summary).length} summarized`,
    );
    return summarized;
  }

  private async enrichArticle(
    article: ParsedArticle,
  ): Promise<{ summary: string | null; translatedTitle: string | null }> {
    try {
      const result = await this.llmProvider.translateAndSummarize({
        originalText: article.body,
        title: article.title,
        sourceLanguage: 'en',
        targetLanguage: 'pt-BR',
        maxSummaryChars: 600,
      });
      return {
        summary: result.summary,
        translatedTitle: result.translatedTitle,
      };
    } catch (error) {
      this.logger.error(
        `Error enriching article ${article.title}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return { summary: null, translatedTitle: null };
    }
  }

  private async fetchPortal(portal: ScrapPortal): Promise<ParsedArticle[]> {
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

    for (const article of articles) {
      const existing = article.guid
        ? ((await this.scrapedArticleRepository.findByGuid(article.guid)) ??
          (await this.scrapedArticleRepository.findByUrl(article.url)))
        : await this.scrapedArticleRepository.findByUrl(article.url);

      if (!existing) {
        await this.scrapedArticleRepository.create({
          portal: portal.name,
          url: article.url,
          title: article.title,
          body: article.body,
          guid: article.guid,
          imageUrl: article.imageUrl,
        });
      }
    }

    return articles;
  }

  private async processArticle(article: any): Promise<void> {
    this.logger.log(`Processing article: ${article.title}`);

    const isDuplicateUrl = await this.contentsRepository.findByOriginalUrl(
      article.url,
    );
    if (isDuplicateUrl) {
      this.logger.log(`Skipping duplicate URL: ${article.url}`);
      await this.scrapedArticleRepository.markError(
        article._id.toString(),
        'Duplicate URL',
      );
      return;
    }

    const normalizedTitle = article.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const isDuplicateTitle =
      await this.contentsRepository.findByTitlePattern(normalizedTitle);
    if (isDuplicateTitle) {
      this.logger.log(`Skipping duplicate title: ${article.title}`);
      await this.scrapedArticleRepository.markError(
        article._id.toString(),
        'Duplicate title',
      );
      return;
    }

    const result = await this.llmProvider.translateAndSummarize({
      originalText: article.body,
      sourceLanguage: 'en',
      targetLanguage: 'pt-BR',
      maxSummaryChars: 600,
    });

    const slug = this.generateSlug(article.title);

    const content = await this.contentsRepository.create({
      type: 'NEWS',
      title: article.title,
      slug,
      summary: result.summary,
      body: result.translatedText,
      isCurated: true,
      originalSourceUrl: article.url,
      originalSourceName: article.portal,
      tags: [],
      status: 'PUBLISHED',
      publishedAt: new Date(),
    });

    await this.scrapedArticleRepository.markProcessed(
      article._id.toString(),
      result.summary,
      content._id?.toString() ?? '',
    );

    this.logger.log(`Article processed: ${article.title}`);
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
