import { Podcast } from "../../infra/schemas/podcast.schema";

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
  create(data: CreatePodcastInput): Promise<Podcast>;
  update(id: string, data: Partial<CreatePodcastInput>): Promise<Podcast | null>;
  delete(id: string): Promise<any>;
}