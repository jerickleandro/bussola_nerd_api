import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SpotifyProvider } from './spotify.provider.interface';

@Injectable()
export class HttpSpotifyProvider implements SpotifyProvider {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly showId: string;

  constructor(private readonly configService: ConfigService) {
    const spotifyConfig = this.configService.get('spotify');
    this.clientId = spotifyConfig.clientId;
    this.clientSecret = spotifyConfig.clientSecret;
    this.showId = spotifyConfig.showId;
  }

  async fetchEpisodes(): Promise<any[]> {
    // TODO: implementar fluxo de autenticação + chamada à API do Spotify
    return [];
  }
}
