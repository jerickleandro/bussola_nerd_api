import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScrapService } from './scrap.service';
import { ScrapScheduler } from './scrap.scheduler';
import { ScrapController } from './scrap.controller';
import { SCRAPED_ARTICLE_REPOSITORY } from './domain/interfaces/scraped-article.repository.interface';
import { ScrapedArticleMongooseRepository } from './infra/scraped-article.repository';
import {
  ScrapedArticle,
  ScrapedArticleSchema,
} from './infra/schemas/scraped-article.schema';
import { ContentsModule } from '../contents/contents.module';
import { LlmModule } from '../../shared/providers/llm/llm.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ScrapedArticle.name, schema: ScrapedArticleSchema },
    ]),
    ContentsModule,
    LlmModule,
  ],
  controllers: [ScrapController],
  providers: [
    ScrapService,
    ScrapScheduler,
    {
      provide: SCRAPED_ARTICLE_REPOSITORY,
      useClass: ScrapedArticleMongooseRepository,
    },
  ],
  exports: [ScrapService],
})
export class ScrapModule {}
