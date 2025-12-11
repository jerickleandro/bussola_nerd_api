import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CONTENTS_REPOSITORY } from '../contents/domain/interfaces/contents.repository.interface';
import { LLM_PROVIDER } from '../../shared/providers/llm/llm.provider.interface';

import type { ContentsRepository } from '../contents/domain/interfaces/contents.repository.interface';
import type { LlmProvider } from '../../shared/providers/llm/llm.provider.interface';

@Injectable()
export class IntegrationService {
  private readonly scrapApiKey: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(CONTENTS_REPOSITORY)
    private readonly contentsRepository: ContentsRepository,
    @Inject(LLM_PROVIDER)
    private readonly llmProvider: LlmProvider,
  ) {
    const scrapConfig = this.configService.get('scrap');
    this.scrapApiKey = scrapConfig.apiKey;
  }

  async importNewsFromScrap(
    apiKey: string,
    payload: {
      title: string;
      text: string;
      url: string;
      sourceName?: string;
      tags?: string[];
    },
  ) {
    if (apiKey !== this.scrapApiKey) {
      throw new UnauthorizedException('Invalid scrap API key');
    }

    const result = await this.llmProvider.translateAndSummarize({
      originalText: payload.text,
      sourceLanguage: 'auto',
      targetLanguage: 'pt-BR',
      maxSummaryChars: 600,
    });

    // aqui, você poderia gerar slug a partir do título
    const slug = this.generateSlug(payload.title);

    const content = await this.contentsRepository.create({
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

    return content;
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
