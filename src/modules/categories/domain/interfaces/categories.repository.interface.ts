export interface CreateCategoryInput {
  name: string;
  slug: string;
}

export const CATEGORIES_REPOSITORY = 'CATEGORIES_REPOSITORY';

export interface CategoriesRepository {
  create(data: CreateCategoryInput): Promise<any>; 
  findAll(): Promise<any[]>; 
  findById(id: string): Promise<any>;
  update(id: string, data: Partial<CreateCategoryInput>): Promise<any>;
  deactivate(id: string, data: Partial<{ isActive: boolean }>): Promise<any>;
  findBySlug(slug: string): Promise<any | null>;
}