import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ContentsRepository,
  CreateContentInput,
} from '../domain/interfaces/contents.repository.interface';
import { Content, ContentDocument } from './schemas/content.schema';
import { FindContentsQueryDto } from '../dto/find-contents.query.dto';

export class ContentsMongooseRepository implements ContentsRepository {
  constructor(
    @InjectModel(Content.name)
    private readonly contentModel: Model<ContentDocument>,
  ) {}

  async findAll(query: FindContentsQueryDto = {}): Promise<Content[]> {
    const filter: any = {};

    if (query.type) {
      filter.type = query.type;
    }

    if (query.category) {
      filter.categoryId = query.category;
    }

    // Regras (page começa em 1)
    const limit = Math.min(Math.max(query.limit ?? 20, 1), 50);
    const page = Math.max(query.page ?? 1, 1);
    const skip = (page - 1) * limit;

    return this.contentModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
  }

  async findBySlug(slug: string): Promise<Content | null> {
    return this.contentModel.findOne({ slug }).lean().exec();
  }

  async findById(id: string): Promise<Content | null> {
    return this.contentModel.findById(id).lean().exec();
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

  async delete(id: string): Promise<Content | null> {
    return this.contentModel.findOneAndDelete({ _id: id }).lean().exec();
  }
}
