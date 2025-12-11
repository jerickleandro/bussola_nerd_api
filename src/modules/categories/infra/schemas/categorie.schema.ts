import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Categorie {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;
}

export type CategorieDocument = Categorie & Document;
export const CategorieSchema = SchemaFactory.createForClass(Categorie);
