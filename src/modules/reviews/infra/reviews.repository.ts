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

  async findByReviewer(id: string[]): Promise<any[]> {
    return this.reviewModel.find({ reviewer: { $in: id } }).lean().exec();
  }
  

  async create(data: any) {
    const createdReview = new this.reviewModel(data);
    return createdReview.save();
  }

  async update(id: string, data: any) {
    return this.reviewModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }
}
