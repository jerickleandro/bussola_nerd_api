import { registerAs } from '@nestjs/config';

export const scrapConfig = registerAs('scrap', () => ({
  apiKey: process.env.SCRAP_API_KEY,
}));
