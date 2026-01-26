import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreatePodcastInput,
  PodcastsRepository,
} from '../domain/interfaces/podcasts.repository.interface';
import { Podcast, PodcastDocument } from './schemas/podcast.schema';

export class PodcastsMongooseRepository implements PodcastsRepository {
  constructor(
    @InjectModel(Podcast.name)
    private readonly podcastModel: Model<PodcastDocument>,
  ) { }

  findAll(query?: any): Promise<Podcast[]> {
  const filter: any = {};

  if(query.categorieId !== undefined) {
    filter.categoryId = query.categorieId;
  }

  if(query.categoryId !== undefined) {
    filter.categoryId = query.categoryId;
  }
  
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 50);
  const page = Math.max(Number(query.page) || 1, 1);
  const skip = (page - 1) * limit;
  

  return this.podcastModel
    .find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
}

  findById(id: string): Promise<Podcast | null> {
    return this.podcastModel.findById(id).lean().exec();
  }
  create(data: CreatePodcastInput): Promise<Podcast> {
    const created = new this.podcastModel(data);
    return created.save();
  }
  update(id: string, data: Partial<CreatePodcastInput>) {
    return this.podcastModel
      .findByIdAndUpdate(id, data, { new: true })
      .lean()
      .exec();
  }
  delete(id: string) {
    return this.podcastModel.findByIdAndDelete(id).lean().exec();
  }
}
