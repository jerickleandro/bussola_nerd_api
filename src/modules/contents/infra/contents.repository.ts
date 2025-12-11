import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ContentsRepository,
  CreateContentInput,
} from '../domain/interfaces/contents.repository.interface';
import { Content, ContentDocument } from './schemas/content.schema';

export class ContentsMongooseRepository implements ContentsRepository {
  constructor(
    @InjectModel(Content.name)
    private readonly contentModel: Model<ContentDocument>,
  ) {}

  async findAll(): Promise<Content[]> {
    return this.contentModel.find().lean().exec();
  }

  async findBySlug(slug: string): Promise<Content | null> {
    return this.contentModel.findOne({ slug }).lean().exec();
  }

  async create(data: CreateContentInput): Promise<Content> {
    const created = new this.contentModel(data);
    return created.save();
  }

  async update(
    slug: string,
    data: Partial<CreateContentInput>,
  ): Promise<Content | null> {
    return this.contentModel
      .findOneAndUpdate({ slug }, data, { new: true })
      .lean()
      .exec();
  }
}
