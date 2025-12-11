import { Controller, Get, Post, Body } from '@nestjs/common';
import { ReviewsService } from './domain/reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Post()
  create(@Body() body: CreateReviewDto) {
    return this.reviewsService.create(body);
  }
}