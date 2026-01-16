import { Podcast } from "../../infra/schemas/podcast.schema";
import { CreatePodcastDto } from "../dto/create-podcast.dto";

export interface CreatePodcastInput {
  title: string;
  description: string;
  guest?: string[];
  categoryId?: string;
  coverImageUrl?: string;
  spotifyId?: string;
  spotifyUrl?: string;
  publishDate?: Date;
  durationInMinutes?: number;
  status: 'DRAFT' | 'PUBLISHED';
}

export const PODCASTS_REPOSITORY = 'PODCASTS_REPOSITORY';

export interface PodcastsRepository {
  findAll(): Promise<Podcast[]>;
  findById(id: string): Promise<Podcast | null>;
  create(data: CreatePodcastDto): Promise<Podcast>;
  update(id: string, data: Partial<CreatePodcastDto>): Promise<Podcast | null>;
  delete(id: string): Promise<any>;
}