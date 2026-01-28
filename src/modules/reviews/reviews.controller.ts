import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './domain/reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { Public } from '../../common/decorators/public.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Public()
  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Public()
  @Get('/reviewer')
  findByReviewer(@Query('reviewer') reviewerId: string | string[]) {
    const ids = Array.isArray(reviewerId) ? reviewerId : [reviewerId];
    return this.reviewsService.findByReviewer(ids);
  }

  @Roles(Role.EDITOR, Role.ADMIN)
  @Post()
  create(@Body() body: CreateReviewDto) {
    return this.reviewsService.create(body);
  }

  @Roles(Role.EDITOR, Role.ADMIN)
  @Patch(':id')
  update(@Body() body: Partial<CreateReviewDto>, @Param('id') id: string) {
    return this.reviewsService.update(id, body);
  }
}
