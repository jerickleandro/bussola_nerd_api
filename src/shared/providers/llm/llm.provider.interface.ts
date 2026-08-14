export const LLM_PROVIDER = 'LLM_PROVIDER';

export interface LlmProvider {
  translateAndSummarize(input: {
    originalText: string;
    title?: string;
    sourceLanguage: string;
    targetLanguage: string;
    maxSummaryChars?: number;
  }): Promise<{
    translatedTitle: string;
    translatedText: string;
    summary: string;
  }>;
}

export interface LlmProviderRegistration {
  name: string;
  provider: LlmProvider;
}
