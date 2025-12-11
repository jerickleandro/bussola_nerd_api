import { Injectable } from '@nestjs/common';

@Injectable()
export class PodcastsService {
  async listEpisodes() {
    return [];
  }

  async syncFromSpotify() {
    // será usado para integração com API do Spotify
    return { synced: true };
  }
}