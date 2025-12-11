export const LLM_PROVIDER = 'LLM_PROVIDER';

export interface LlmProvider {
  translateAndSummarize(input: {
    originalText: string;
    sourceLanguage: string;
    targetLanguage: string;
    maxSummaryChars?: number;
  }): Promise<{
    translatedText: string;
    summary: string;
  }>;
}
