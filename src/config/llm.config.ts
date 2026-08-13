import { registerAs } from '@nestjs/config';

export const llmConfig = registerAs('llm', () => ({
  provider: process.env.LLM_PROVIDER ?? 'openrouter',
  apiKey: process.env.LLM_API_KEY,
  baseUrl: process.env.LLM_API_BASE_URL ?? 'https://openrouter.ai/api/v1',
  model: process.env.LLM_MODEL ?? 'openai/gpt-4o-mini',
}));
