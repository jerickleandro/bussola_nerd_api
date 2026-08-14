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
  private readonly maxTokens: number;
  private readonly maxInputChars = 2000;
  private readonly maxTextChars = 1200;

  constructor(private readonly configService: ConfigService) {
    const llmConfig = this.configService.get('llm');
    this.apiKey = llmConfig.apiKey;
    this.baseUrl = llmConfig.baseUrl ?? 'https://openrouter.ai/api/v1';
    this.model = llmConfig.model ?? 'openai/gpt-4o-mini';
    this.maxTokens = llmConfig.maxTokens ?? 1024;
  }

  async translateAndSummarize(input: {
    originalText: string;
    title?: string;
    sourceLanguage: string;
    targetLanguage: string;
    maxSummaryChars?: number;
    categories?: { id: string; name: string; slug: string }[];
    tagTopics?: string[];
  }): Promise<{
    translatedTitle: string;
    translatedText: string;
    summary: string;
    categorySlug?: string;
    tags?: string[];
  }> {
    const maxChars = input.maxSummaryChars ?? 600;

    const categoryPrompt = input.categories?.length
      ? `\n4. Classify the article into exactly ONE of the following categories (return its "slug" value verbatim):\n${input.categories
          .map((c) => `- name: "${c.name}" | slug: "${c.slug}"`)
          .join('\n')}\nOnly use one of these slugs.`
      : '';

    const tagPrompt = input.tagTopics?.length
      ? `\n5. Choose 3 to 5 tags for the article from the following list (return them exactly as written, no new ones):\n${input.tagTopics.map((t) => `- "${t}"`).join('\n')}`
      : '';

    const systemPrompt = `You are a professional translator and summarizer for a Brazilian Portuguese news site.
Tasks:
1. Translate the given title to Brazilian Portuguese (pt-BR).
2. Translate the following text to Brazilian Portuguese (pt-BR), keeping the translated text under ${this.maxTextChars} characters.
3. Create a concise summary of the translated text, limited to ${maxChars} characters.${categoryPrompt}${tagPrompt}

Respond ONLY with valid JSON in this exact format:
{
  "translatedTitle": "the translated title here",
  "translatedText": "the full translated text here",
  "summary": "the concise summary here",
  "categorySlug": "the chosen category slug (omit if not provided)",
  "tags": ["tag1", "tag2", "tag3"]
}

Do not include any other text, markdown, or explanation outside the JSON.`;

    const userMessage = input.title
      ? `Title:\n${input.title}\n\nText:\n${input.originalText.slice(0, this.maxInputChars)}`
      : input.originalText.slice(0, this.maxInputChars);

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
          max_tokens: this.maxTokens,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
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
        translatedTitle?: string;
        translatedText?: string;
        summary?: string;
        categorySlug?: string;
        tags?: string[];
      };
      return {
        translatedTitle: result.translatedTitle ?? input.title ?? '',
        translatedText: result.translatedText ?? input.originalText,
        summary: result.summary ?? '',
        categorySlug: result.categorySlug,
        tags: Array.isArray(result.tags) ? result.tags : [],
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
