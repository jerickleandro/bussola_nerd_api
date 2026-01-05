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
    if(Object.keys(query).length) {
      const mongooseQuery: any = {};
      if (query.type) {
        mongooseQuery.type = query.type;
      }
      if (query.category) {
        mongooseQuery.category = query.category;
      }
      if (query.limit) {
        mongooseQuery.limit = query.limit;
      }
      if( query.page) {
        mongooseQuery.page = query.page;
      }
      return this.contentModel.find(mongooseQuery).lean().exec();
    }
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
