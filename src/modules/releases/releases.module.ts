import { Module } from '@nestjs/common';
import { ReleasesService } from './releases.service';
import { ReleasesController } from './releases.controller';
import { RELEASES_API_PROVIDER } from '../../shared/providers/releases-api/releases-api.provider.interface';
import { HttpReleasesApiProvider } from '../../shared/providers/releases-api/releases-api.provider';

@Module({
  controllers: [ReleasesController],
  providers: [
    ReleasesService,
    {
      provide: RELEASES_API_PROVIDER,
      useClass: HttpReleasesApiProvider,
    },
  ],
  exports: [ReleasesService, RELEASES_API_PROVIDER],
})
export class ReleasesModule {}
