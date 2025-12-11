import { Controller, Get, Post } from '@nestjs/common';
import { PodcastsService } from './domain/podcasts.service';

@Controller('podcasts')
export class PodcastsController {
  constructor(private readonly podcastsService: PodcastsService) {}

  @Get('episodes')
  listEpisodes() {
    return this.podcastsService.listEpisodes();
  }

  @Post('sync')
  syncFromSpotify() {
    return this.podcastsService.syncFromSpotify();
  }
}
