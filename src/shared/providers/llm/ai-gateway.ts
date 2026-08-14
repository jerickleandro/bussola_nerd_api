import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  LlmProvider,
  LlmProviderRegistration,
} from './llm.provider.interface';

@Injectable()
export class AiGateway implements LlmProvider {
  private readonly logger = new Logger(AiGateway.name);
  private readonly activeProvider: LlmProvider;

  constructor(
    private readonly providers: LlmProviderRegistration[],
    private readonly configService: ConfigService,
  ) {
    const llmConfig = this.configService.get('llm');
    const activeName = llmConfig.provider ?? 'openrouter';

    const active = this.providers.find((p) => p.name === activeName);
    if (!active) {
      throw new Error(
        `AI Gateway: provider "${activeName}" is not registered. Available: ${this.providers
          .map((p) => p.name)
          .join(', ') || 'none'}`,
      );
    }

    this.activeProvider = active.provider;
    this.logger.log(`AI Gateway routing LLM calls to provider: ${activeName}`);
  }

  async translateAndSummarize(input: {
    originalText: string;
    title?: string;
    sourceLanguage: string;
    targetLanguage: string;
    maxSummaryChars?: number;
  }): Promise<{
    translatedTitle: string;
    translatedText: string;
    summary: string;
  }> {
    return this.activeProvider.translateAndSummarize(input);
  }
}
