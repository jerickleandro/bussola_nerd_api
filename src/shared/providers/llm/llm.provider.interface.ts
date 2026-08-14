export const LLM_PROVIDER = 'LLM_PROVIDER';

export interface LlmCategoryOption {
  id: string;
  name: string;
  slug: string;
}

export interface LlmProvider {
  translateAndSummarize(input: {
    originalText: string;
    title?: string;
    sourceLanguage: string;
    targetLanguage: string;
    maxSummaryChars?: number;
    categories?: LlmCategoryOption[];
    tagTopics?: string[];
  }): Promise<{
    translatedTitle: string;
    translatedText: string;
    summary: string;
    categorySlug?: string;
    tags?: string[];
  }>;
}

export interface LlmProviderRegistration {
  name: string;
  provider: LlmProvider;
}
