import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Review {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true, enum: ['FILME', 'SERIE', 'GAME', 'LIVRO'] })
  type: 'FILME' | 'SERIE' | 'GAME' | 'LIVRO';
}

export type ReviewDocument = Review & Document;
export const ReviewSchema = SchemaFactory.createForClass(Review);
