import { Injectable, Inject } from '@nestjs/common';
import { CATEGORIES_REPOSITORY } from './interfaces/categories.repository.interface';
import type { CategoriesRepository } from './interfaces/categories.repository.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(CATEGORIES_REPOSITORY)
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async findAll() {
    return this.categoriesRepository.findAll();
  }

  async findOne(id: string) {
    return this.categoriesRepository.findById(id);
  }

  async findBySlug(slug: string) {
    return this.categoriesRepository.findBySlug(slug);
  }

  async create(payload: any) {
    return this.categoriesRepository.create(payload);
  }

  async update(id: string, payload: any) {
    return this.categoriesRepository.update(id, payload);
  }

  async remove(id: string) {
    const category = await this.categoriesRepository.findById(id);
    if (category) {
      await this.categoriesRepository.deactivate(id, { isActive: false });
    }
    return category;
  }
}
