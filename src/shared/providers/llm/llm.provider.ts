import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LlmProvider } from './llm.provider.interface';

@Injectable()
export class HttpLlmProvider implements LlmProvider {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    const llmConfig = this.configService.get('llm');
    this.apiKey = llmConfig.apiKey;
    this.baseUrl = llmConfig.baseUrl;
    this.model = llmConfig.model;
  }

  async translateAndSummarize(input: {
    originalText: string;
    sourceLanguage: string;
    targetLanguage: string;
    maxSummaryChars?: number;
  }): Promise<{ translatedText: string; summary: string }> {
    // TODO: implementar chamada HTTP real
    // por enquanto retorna algo mockado
    return {
      translatedText: '[mock] ' + input.originalText,
      summary: '[mock summary]',
    };
  }
}
