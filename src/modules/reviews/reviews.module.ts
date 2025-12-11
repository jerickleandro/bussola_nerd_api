import { Module } from '@nestjs/common';
import { ReviewsService } from './domain/reviews.service';
import { ReviewsController } from './reviews.controller';
import { REVIEWS_REPOSITORY } from './domain/interfaces/reviews.repository.interface';
import { Review, ReviewSchema } from './infra/schemas/reviews.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewsMongooseRepository } from './infra/reviews.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
  ],
  controllers: [ReviewsController],
  providers: [
    ReviewsService,
    {
      provide: REVIEWS_REPOSITORY,
      useClass: ReviewsMongooseRepository,
    },
  ],
  exports: [ReviewsService, REVIEWS_REPOSITORY],
})
export class ReviewsModule {}
