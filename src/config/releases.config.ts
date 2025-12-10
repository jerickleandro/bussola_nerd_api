import { registerAs } from '@nestjs/config';

export const releasesConfig = registerAs('releasesApi', () => ({
  baseUrl: process.env.RELEASES_API_BASE_URL,
  apiKey: process.env.RELEASES_API_KEY,
}));
