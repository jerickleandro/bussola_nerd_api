import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class Score {
  @Prop({ required: true, min: 0 })
  score: number;

  @Prop({ required: true })
  userId: string;
}

export const ScoreSchema = SchemaFactory.createForClass(Score);

@Schema({ timestamps: true })
export class Review {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ type: [ScoreSchema], required: true, default: [] })
  scores: Score[];

  @Prop({ required: true, enum: ['FILME', 'SERIE', 'GAME', 'LIVRO'] })
  type: 'FILME' | 'SERIE' | 'GAME' | 'LIVRO';

  @Prop({ required: true, min: 0 })
  year: number;

  @Prop({ required: true, type: [String], default: [] })
  genres: string[];

  @Prop({ required: true, type: [String], default: [] })
  platforms: string[];

  @Prop({ required: true })
  synopsis: string;

  @Prop({ required: true, type: [String], default: [] })
  reviewer: string[];

  @Prop({ type: [String], default: [] })
  cast?: string[];

  @Prop()
  director?: string;

  @Prop()
  author?: string;

  @Prop()
  publisher?: string;

  @Prop({ required: true })
  review: string;

  @Prop()
  urlPodcastEpisode?: string;

  @Prop()
  urlIdPodcastEpisode?: string;
}

export type ReviewDocument = Review & Document;
export const ReviewSchema = SchemaFactory.createForClass(Review);
