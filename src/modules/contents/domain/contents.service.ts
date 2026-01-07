import { Inject, Injectable } from '@nestjs/common';
import { CONTENTS_REPOSITORY } from './interfaces/contents.repository.interface';
import type {
  ContentsRepository,
  CreateContentInput,
} from './interfaces/contents.repository.interface';
import { FindContentsQueryDto } from '../dto/find-contents.query.dto';

@Injectable()
export class ContentsService {
  constructor(
    @Inject(CONTENTS_REPOSITORY)
    private readonly contentsRepository: ContentsRepository,
  ) {}

  async findAll(query?: FindContentsQueryDto) {
    return this.contentsRepository.findAll(query);
  }

  async findBySlug(slug: string) {
    return this.contentsRepository.findBySlug(slug);
  }

  async findById(id: string) {
    return this.contentsRepository.findById(id);
  }

  async create(payload: CreateContentInput) {
    const type = payload.type ?? 'NEWS';
    payload.type = type;
    const slug =
      payload.slug ?? payload.title.toLowerCase().replace(/\s+/g, '-');
    if (await this.contentsRepository.findBySlug(slug)) {
      payload.slug = slug + '-' + Date.now();
    } else payload.slug = slug;
    return this.contentsRepository.create(payload);
  }

  async update(
    slug: string,
    payload: Partial<CreateContentInput>,
    publishedAt?: Date,
  ) {
    if (publishedAt) {
      payload.publishedAt = publishedAt;
    }
    return this.contentsRepository.update(slug, payload);
  }

  async delete(id: string) {
    const content = await this.contentsRepository.findById(id);
    if (!content) {
      return null;
    }
    return this.contentsRepository.delete(id);
  }
}
