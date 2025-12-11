import { Inject, Injectable } from '@nestjs/common';
import { SPOTIFY_PROVIDER } from '../../../shared/providers/spotify/spotify.provider.interface';

import type { SpotifyProvider } from '../../../shared/providers/spotify/spotify.provider.interface';

@Injectable()
export class PodcastsService {
  constructor(
    @Inject(SPOTIFY_PROVIDER)
    private readonly spotifyProvider: SpotifyProvider,
  ) {}

  async listEpisodes() {
    // se tiver cache ou banco, você orquestra aqui
    return this.spotifyProvider.fetchEpisodes();
  }

  async syncFromSpotify() {
    const episodes = await this.spotifyProvider.fetchEpisodes();
    // aqui você poderia salvar no banco via repositório próprio de Podcasts
    return { syncedCount: episodes.length };
  }
}
