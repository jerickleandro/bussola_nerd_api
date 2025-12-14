
export const REVIEWS_REPOSITORY = 'REVIEWS_REPOSITORY';


export interface ReviewsRepository {
  findAll(): Promise<any[]>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
}