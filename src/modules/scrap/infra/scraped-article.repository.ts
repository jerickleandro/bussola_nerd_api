import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ScrapedArticleRepository,
  CreateScrapedArticleInput,
} from '../domain/interfaces/scraped-article.repository.interface';
import {
  ScrapedArticle,
  ScrapedArticleDocument,
} from './schemas/scraped-article.schema';

export class ScrapedArticleMongooseRepository implements ScrapedArticleRepository {
  constructor(
    @InjectModel(ScrapedArticle.name)
    private readonly model: Model<ScrapedArticleDocument>,
  ) {}

  async findAll(): Promise<ScrapedArticle[]> {
    return this.model.find().sort({ createdAt: -1 }).lean().exec();
  }

  async findByUrl(url: string): Promise<ScrapedArticle | null> {
    return this.model.findOne({ url }).lean().exec();
  }

  async findByGuid(guid: string): Promise<ScrapedArticle | null> {
    return this.model.findOne({ guid }).lean().exec();
  }

  async findUnprocessed(): Promise<ScrapedArticle[]> {
    return this.model
      .find({ processed: false, error: { $exists: false } })
      .lean()
      .exec();
  }

  async create(data: CreateScrapedArticleInput): Promise<ScrapedArticle> {
    const created = new this.model(data);
    return created.save();
  }

  async markProcessed(
    id: string,
    summary: string,
    contentId: string,
  ): Promise<ScrapedArticle | null> {
    return this.model
      .findByIdAndUpdate(
        id,
        { processed: true, summary, contentId },
        { new: true },
      )
      .lean()
      .exec();
  }

  async markError(id: string, error: string): Promise<ScrapedArticle | null> {
    return this.model
      .findByIdAndUpdate(id, { error }, { new: true })
      .lean()
      .exec();
  }
}
