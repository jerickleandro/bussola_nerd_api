import { Module } from '@nestjs/common';
import { CategoriesService } from './domain/categories.service';
import { CategoriesController } from './categories.controller';
import { CATEGORIES_REPOSITORY } from './domain/interfaces/categories.repository.interface';
import { CategoriesMongooseRepository } from './infra/categories.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Categorie, CategorieSchema } from './infra/schemas/categorie.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Categorie.name, schema: CategorieSchema },
    ]),
  ],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    {
      provide: CATEGORIES_REPOSITORY,
      useClass: CategoriesMongooseRepository,
    },
  ],
  exports: [CategoriesService],
})
export class CategoriesModule {}
