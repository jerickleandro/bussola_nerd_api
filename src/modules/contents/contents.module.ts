import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentsController } from './contents.controller';
import { ContentsService } from './domain/contents.service';
import { CONTENTS_REPOSITORY } from './domain/interfaces/contents.repository.interface';
import { ContentsMongooseRepository } from './infra/contents.repository';
import { Content, ContentSchema } from './infra/schemas/content.schema';
import { CategoriesService } from '../categories/domain/categories.service';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Content.name, schema: ContentSchema }]),
    CategoriesModule,
  ],
  controllers: [ContentsController],
  providers: [
    ContentsService,
    {
      provide: CONTENTS_REPOSITORY,
      useClass: ContentsMongooseRepository,
    },
  ],
  exports: [ContentsService, CONTENTS_REPOSITORY],
})
export class ContentsModule {}
