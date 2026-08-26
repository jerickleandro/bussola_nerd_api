import { Controller, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ReleasesService } from './releases.service';
import { Public } from '../../common/decorators/public.decorator';

@Public()
@Controller('releases')
export class ReleasesController {
  constructor(private readonly releasesService: ReleasesService) {}

  @Get()
  listByMonth(
    @Query('year', new ParseIntPipe({ optional: true })) year?: number,
    @Query('month', new ParseIntPipe({ optional: true })) month?: number,
  ) {
    const now = new Date();
    const resolvedYear = year ?? now.getFullYear();
    const resolvedMonth = month ?? now.getMonth() + 1;
    return this.releasesService.listByMonth(resolvedYear, resolvedMonth);
  }

  @Post('sync')
  syncFromExternalApi() {
    return this.releasesService.syncFromExternalApi();
  }
}
