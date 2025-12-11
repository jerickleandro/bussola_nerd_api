import { Injectable } from '@nestjs/common';

@Injectable()
export class ReleasesService {
  async listByMonth(year: number, month: number) {
    return [];
  }

  async syncFromExternalApi() {
    return { synced: true };
  }
}