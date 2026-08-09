import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PODCASTS_REPOSITORY } from './interfaces/podcasts.repository.interface';
import type {
  PodcastsRepository,
  CreatePodcastInput,
} from './interfaces/podcasts.repository.interface';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { AnchorRssParser } from './parsers/anchor-rss.parser';
import type { ParsedPodcastEpisode } from './parsers/anchor-rss.parser';

@Injectable()
export class PodcastsService {
  private readonly logger = new Logger(PodcastsService.name);

  constructor(
    @Inject(PODCASTS_REPOSITORY)
    private readonly podcastsRepository: PodcastsRepository,
    private readonly configService: ConfigService,
  ) {}

  async listEpisodes(query?: any): Promise<any[]> {
    if (query?.categories !== undefined) {
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

  async syncFromFeed(): Promise<{
    imported: number;
    skipped: number;
    total: number;
    episodes: ParsedPodcastEpisode[];
  }> {
    const feedUrl = this.configService.get<string>('spotify.feedUrl');
    if (!feedUrl) {
      throw new Error('Podcast feed URL is not configured');
    }

    this.logger.log(`Fetching podcast feed: ${feedUrl}`);

    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'BussolaNerdBot/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} fetching ${feedUrl}`);
    }

    const xml = await response.text();
    const parser = new AnchorRssParser();
    const episodes = parser.parse(xml);

    let imported = 0;
    let skipped = 0;

    for (const episode of episodes) {
      const existing = episode.guid
        ? await this.podcastsRepository.findBySpotifyId(episode.guid)
        : null;

      if (existing) {
        skipped++;
        continue;
      }

      const data: CreatePodcastInput = {
        title: episode.title,
        description: episode.description,
        spotifyId: episode.guid,
        spotifyUrl: episode.link,
        coverImageUrl: episode.coverImageUrl,
        audioUrl: episode.audioUrl,
        publishDate: episode.publishDate,
        durationInMinutes: episode.durationInMinutes,
        status: 'PUBLISHED',
      };

      await this.podcastsRepository.create(data);
      imported++;
    }

    this.logger.log(
      `Podcast feed synced: ${imported} imported, ${skipped} skipped`,
    );
    return { imported, skipped, total: episodes.length, episodes };
  }

  // async syncFromSpotify() {
  //   const episodes = await this.podcastsRepository.findAll();
  //   // aqui você poderia salvar no banco via repositório próprio de Podcasts
  //   return { syncedCount: episodes.length };
  // }
}
