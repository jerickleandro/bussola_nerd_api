import { Module } from '@nestjs/common';
import { PodcastsController } from './podcasts.controller';
import { PodcastsService } from './domain/podcasts.service';
import {
  SPOTIFY_PROVIDER
} from '../../shared/providers/spotify/spotify.provider.interface';
import { HttpSpotifyProvider } from '../../shared/providers/spotify/spotify.provider';

@Module({
  imports: [],
  controllers: [PodcastsController],
  providers: [
    PodcastsService,
    {
      provide: SPOTIFY_PROVIDER,
      useClass: HttpSpotifyProvider
    }
  ],
  exports: [PodcastsService]
})
export class PodcastsModule {}
