import { registerAs } from '@nestjs/config';

export const spotifyConfig = registerAs('spotify', () => ({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  showId: process.env.SPOTIFY_SHOW_ID,
}));
