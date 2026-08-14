import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),

  // Mongo
  MONGODB_URI: Joi.string().uri().required(),
  MONGODB_DB: Joi.string().required(),

  // JWT
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('1h'),

  // Spotify
  SPOTIFY_CLIENT_ID: Joi.string().required(),
  SPOTIFY_CLIENT_SECRET: Joi.string().required(),
  SPOTIFY_SHOW_ID: Joi.string().required(),

  // Feed RSS do podcast (Anchor/Spotify for Podcasters)
  PODCAST_FEED_URL: Joi.string().uri().optional(),

  // API externa de lançamentos
  RELEASES_API_BASE_URL: Joi.string().uri().required(),
  RELEASES_API_KEY: Joi.string().required(),

  // Serviço de scrap
  SCRAP_API_KEY: Joi.string().required(),
  SCRAP_CRON: Joi.string().default('0 */12 * * *'),

  // LLM (AI Gateway -> OpenRouter por padrão)
  LLM_PROVIDER: Joi.string().default('openrouter'),
  LLM_API_KEY: Joi.string().required(),
  LLM_API_BASE_URL: Joi.string().uri().default('https://openrouter.ai/api/v1'),
  LLM_MODEL: Joi.string().default('openai/gpt-4o-mini'),
  LLM_MAX_TOKENS: Joi.number().default(1024),
});
