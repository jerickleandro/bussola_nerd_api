import { Inject, Injectable } from '@nestjs/common';
import { REVIEWS_REPOSITORY } from './interfaces/reviews.repository.interface';
import type { ReviewsRepository } from './interfaces/reviews.repository.interface';

@Injectable()
export class ReviewsService {
  constructor(
    @Inject(REVIEWS_REPOSITORY)   
    private readonly reviewsRepository: ReviewsRepository,
  ) {}
  async findAll() {
    return this.reviewsRepository.findAll();
  }

  async create(payload: any) {
    return this.reviewsRepository.create(payload);
  }
}