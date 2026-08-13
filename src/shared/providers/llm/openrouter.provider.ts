import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LlmProvider } from './llm.provider.interface';

interface OpenRouterResponse {
  choices?: Array<{ message?: { content?: string } }>;
}

@Injectable()
export class OpenRouterProvider implements LlmProvider {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    const llmConfig = this.configService.get('llm');
    this.apiKey = llmConfig.apiKey;
    this.baseUrl =
      llmConfig.baseUrl ?? 'https://openrouter.ai/api/v1';
    this.model = llmConfig.model ?? 'openai/gpt-4o-mini';
  }

  async translateAndSummarize(input: {
    originalText: string;
    sourceLanguage: string;
    targetLanguage: string;
    maxSummaryChars?: number;
  }): Promise<{ translatedText: string; summary: string }> {
    const maxChars = input.maxSummaryChars ?? 600;

    const systemPrompt = `You are a professional translator and summarizer for a Brazilian Portuguese news site.
Tasks:
1. Translate the following text to Brazilian Portuguese (pt-BR).
2. Create a concise summary of the translated text, limited to ${maxChars} characters.

Respond ONLY with valid JSON in this exact format:
{
  "translatedText": "the full translated text here",
  "summary": "the concise summary here"
}

Do not include any other text, markdown, or explanation outside the JSON.`;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
          'X-Title': 'BussolaNerdApi',
        },
        body: JSON.stringify({
          model: this.model,
          temperature: 0.3,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: input.originalText },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = (await response.json()) as OpenRouterResponse;
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('LLM response does not contain valid content');
      }

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new HttpException(
          'LLM response does not contain valid JSON',
          HttpStatus.BAD_GATEWAY,
        );
      }

      const result = JSON.parse(jsonMatch[0]) as {
        translatedText?: string;
        summary?: string;
      };
      return {
        translatedText: result.translatedText ?? input.originalText,
        summary: result.summary ?? '',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `LLM provider error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
