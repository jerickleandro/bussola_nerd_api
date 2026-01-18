import { Inject, Injectable } from '@nestjs/common';
import { PODCASTS_REPOSITORY } from './interfaces/podcasts.repository.interface';
import type { PodcastsRepository, CreatePodcastInput } from './interfaces/podcasts.repository.interface';
import { CreatePodcastDto } from './dto/create-podcast.dto';

@Injectable()
export class PodcastsService {
  constructor(
    @Inject(PODCASTS_REPOSITORY)
    private readonly podcastsRepository: PodcastsRepository,
  ) { }

  async listEpisodes(query?: any): Promise<any[]> {
    if (query?.categories) {
      query.categoryId = query.categories;
      delete query.categories;
    }
    return this.podcastsRepository.findAll(query);
  }

  async findById(id: string): Promise<any> {
    return this.podcastsRepository.findById(id);
  }

  async create(data: CreatePodcastDto): Promise<any> {
    return this.podcastsRepository.create(data);
  }

  async update(id: string, data: Partial<CreatePodcastDto>): Promise<any> {
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
