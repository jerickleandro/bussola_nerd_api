import { Injectable } from '@nestjs/common';

@Injectable()
export class ContentsService {
  async findAll() {
    return [];
  }

  async findBySlug(slug: string) {
    return { slug };
  }

  async create(payload: any) {
    return payload;
  }
}
