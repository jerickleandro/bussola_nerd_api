import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REVIEWS_REPOSITORY } from './interfaces/reviews.repository.interface';
import type { ReviewsRepository } from './interfaces/reviews.repository.interface';
import { USERS_REPOSITORY } from '../../users/domain/interfaces/users.repository.interface';
import type { UsersRepository } from '../../users/domain/interfaces/users.repository.interface';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UsersService } from '../../users/domain/users.service';

@Injectable()
export class ReviewsService {
  constructor(
    @Inject(REVIEWS_REPOSITORY)
    private readonly reviewsRepository: ReviewsRepository,
    private readonly usersService: UsersService,
  ) {}
  async findAll() {
    return this.reviewsRepository.findAll();
  }

  async findByReviewer(id: string[]) {
    return this.reviewsRepository.findByReviewer(id);
  }

  async create(payload: CreateReviewDto) {
    for(const score of payload.scores) {
      const userId = score.userId.toString();
      const user = await this.usersService.findById(userId);
      if(!user) {
        throw new NotFoundException(`User with id ${userId} not found`)
      }
    }
    for(const userId of payload.reviewer) {
      const user = await this.usersService.findById(userId);
      if(!user) {
        throw new NotFoundException(`User with id ${userId} not found`)
      }
    }
    return this.reviewsRepository.create(payload);
  }

  async update(id: string, payload: any) {
    return this.reviewsRepository.update(id, payload);
  }
}
