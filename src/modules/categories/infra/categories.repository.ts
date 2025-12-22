import { InjectModel } from '@nestjs/mongoose';
import {
  CategoriesRepository,
  CreateCategoryInput,
} from '../domain/interfaces/categories.repository.interface';
import { Categorie } from './schemas/categorie.schema';
import { Model } from 'mongoose';

export class CategoriesMongooseRepository implements CategoriesRepository {
  constructor(
    @InjectModel(Categorie.name)
    private readonly categorieModel: Model<Categorie>,
  ) {}
  create(data: CreateCategoryInput): Promise<any> {
    const created = new this.categorieModel(data);
    return created.save();
  }
  findAll(): Promise<any[]> {
    return this.categorieModel.find().lean().exec();
  }
  findById(id: string): Promise<any> {
    return this.categorieModel.findById(id).lean().exec();
  }
  update(id: string, data: Partial<CreateCategoryInput>): Promise<any> {
    return this.categorieModel
      .findByIdAndUpdate(id, data, { new: true })
      .lean()
      .exec();
  }

  deactivate(id: string, data: Partial<{ isActive: boolean; }>): Promise<any> {
    return this.categorieModel
      .findByIdAndUpdate(id, data, { new: true })
      .lean()
      .exec();
  }
}
