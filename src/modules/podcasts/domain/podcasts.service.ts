import { Inject, Injectable } from '@nestjs/common';
import { PODCASTS_REPOSITORY } from './interfaces/podcasts.repository.interface';
import type { PodcastsRepository, CreatePodcastInput } from './interfaces/podcasts.repository.interface';

@Injectable()
export class PodcastsService {
  constructor(
    @Inject(PODCASTS_REPOSITORY)
    private readonly podcastsRepository: PodcastsRepository,
  ) {}

  async listEpisodes(): Promise<any[]> {
    return this.podcastsRepository.findAll();
  }

  async create(data: CreatePodcastInput): Promise<any> {
    return this.podcastsRepository.create(data);
  }

  async update(id: string, data: Partial<CreatePodcastInput>): Promise<any> {
    return this.podcastsRepository.update(id, data);
  }

  async delete(id: string) {
    return this.podcastsRepository.delete(id);
  }

  // async syncFromSpotify() {
  //   const episodes = await this.podcastsRepository.findAll();
  //   // aqui você poderia salvar no banco via repositório próprio de Podcasts
  //   return { syncedCount: episodes.length };
  // }
}
