import { Inject, Injectable } from '@nestjs/common';
import { CONTENTS_REPOSITORY } from '../contents/domain/interfaces/contents.repository.interface';
import type { ContentsRepository } from '../contents/domain/interfaces/contents.repository.interface';
import { LLM_PROVIDER } from '../../shared/providers/llm/llm.provider.interface';
import type { LlmProvider } from '../../shared/providers/llm/llm.provider.interface';
import { ImportNewsDto } from './dto/import-news.dto';

@Injectable()
export class IntegrationService {
  constructor(
    @Inject(CONTENTS_REPOSITORY)
    private readonly contentsRepository: ContentsRepository,
    @Inject(LLM_PROVIDER)
    private readonly llmProvider: LlmProvider,
  ) {}

  async importNewsFromScrap(payload: ImportNewsDto) {
    const result = await this.llmProvider.translateAndSummarize({
      originalText: payload.text,
      sourceLanguage: 'auto',
      targetLanguage: 'pt-BR',
      maxSummaryChars: 600,
    });

    const slug = this.generateSlug(payload.title);

    return this.contentsRepository.create({
      type: 'NEWS',
      title: payload.title,
      slug,
      summary: result.summary,
      body: result.translatedText,
      isCurated: true,
      originalSourceUrl: payload.url,
      originalSourceName: payload.sourceName,
      tags: payload.tags ?? [],
      status: 'PUBLISHED',
      publishedAt: new Date(),
    });
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
