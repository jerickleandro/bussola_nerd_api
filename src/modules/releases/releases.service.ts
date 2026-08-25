import { Inject, Injectable } from '@nestjs/common';
import { RELEASES_API_PROVIDER } from '../../shared/providers/releases-api/releases-api.provider.interface';
import type { ReleasesApiProvider } from '../../shared/providers/releases-api/releases-api.provider.interface';

@Injectable()
export class ReleasesService {
  constructor(
    @Inject(RELEASES_API_PROVIDER)
    private readonly releasesApiProvider: ReleasesApiProvider,
  ) {}

  async listByMonth(year: number, month: number) {
    return this.releasesApiProvider.fetchReleasesByMonth({ year, month });
  }

  async syncFromExternalApi() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const movies = await this.releasesApiProvider.fetchReleasesByMonth({
      year,
      month,
    });
    return { count: movies.length, movies };
  }
}
