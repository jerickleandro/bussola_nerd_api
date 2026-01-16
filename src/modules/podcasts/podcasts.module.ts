import { Module } from '@nestjs/common';
import { PodcastsController } from './podcasts.controller';
import { PodcastsService } from './domain/podcasts.service';
// import {
//   SPOTIFY_PROVIDER
// } from '../../shared/providers/spotify/spotify.provider.interface';
// import { HttpSpotifyProvider } from '../../shared/providers/spotify/spotify.provider';
import { MongooseModule } from '@nestjs/mongoose';
import { Podcast, PodcastSchema } from './infra/schemas/podcast.schema';
import { PodcastsMongooseRepository } from './infra/podcasts.repository';
import { PODCASTS_REPOSITORY } from './domain/interfaces/podcasts.repository.interface';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Podcast.name, schema: PodcastSchema }]),
  ],
  controllers: [PodcastsController],
  providers: [
    PodcastsService,
    {
      provide: PODCASTS_REPOSITORY,
      useClass: PodcastsMongooseRepository,
    }
  ],
  exports: [PodcastsService]
})
export class PodcastsModule {}
