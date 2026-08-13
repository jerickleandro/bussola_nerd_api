import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { ScrapService } from './scrap.service';

@Injectable()
export class ScrapScheduler {
  private readonly logger = new Logger(ScrapScheduler.name);

  constructor(
    private readonly scrapService: ScrapService,
    private readonly configService: ConfigService,
  ) {}

  @Cron('0 */12 * * *')
  async handleCron(): Promise<void> {
    this.logger.log('Cron triggered: starting scrap pipeline...');
    const articles = await this.scrapService.run();
    this.logger.log(`Cron completed: ${articles.length} articles fetched`);
  }
}
