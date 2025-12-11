import { Controller, Get, Query, Post } from '@nestjs/common';
import { ReleasesService } from './releases.service';

@Controller('releases')
export class ReleasesController {
  constructor(private readonly releasesService: ReleasesService) {}

  @Get()
  listByMonth(
    @Query('year') year: number,
    @Query('month') month: number
  ) {
    return this.releasesService.listByMonth(Number(year), Number(month));
  }

  @Post('sync')
  syncFromExternalApi() {
    return this.releasesService.syncFromExternalApi();
  }
}