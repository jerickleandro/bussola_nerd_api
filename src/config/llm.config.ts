import { registerAs } from '@nestjs/config';

export const llmConfig = registerAs('llm', () => ({
  apiKey: process.env.LLM_API_KEY,
  baseUrl: process.env.LLM_API_BASE_URL,
  model: process.env.LLM_MODEL ?? 'gpt-4.1-mini',
}));
