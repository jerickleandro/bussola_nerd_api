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
  ) {}

  findAll(): Promise<Podcast[]> {
    return this.podcastModel.find().lean().exec();
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
