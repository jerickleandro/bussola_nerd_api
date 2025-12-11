import { Injectable } from '@nestjs/common';

@Injectable()
export class ReviewsService {
  async findAll() {
    return [];
  }

  async create(payload: any) {
    return payload;
  }
}