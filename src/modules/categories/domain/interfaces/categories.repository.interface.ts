export interface CreateCategoryInput {
  name: string;
  slug: string;
}

export interface CategoriesRepository {
  create(data: CreateCategoryInput): Promise<any>; 
  findAll(): Promise<any[]>; 
  findById(id: string): Promise<any>;
  update(id: string, data: Partial<CreateCategoryInput>): Promise<any>;
}