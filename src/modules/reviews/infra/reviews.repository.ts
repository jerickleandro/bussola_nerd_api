import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReviewsRepository } from '../domain/interfaces/reviews.repository.interface';
import { Review, ReviewDocument } from './schemas/reviews.schema';

export class ReviewsMongooseRepository implements ReviewsRepository {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async findAll() {
    return this.reviewModel.find().lean().exec();
  }

  async create(data: any) {
    const createdReview = new this.reviewModel(data);
    return createdReview.save();
  }
}
