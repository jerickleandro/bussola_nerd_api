import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesService {
  // TODO: injetar Model<Category> quando o schema estiver pronto

  async findAll() {
    // placeholder
    return [];
  }

  async findOne(id: string) {
    // placeholder
    return { id };
  }

  async create(payload: any) {
    // placeholder
    return payload;
  }
}
