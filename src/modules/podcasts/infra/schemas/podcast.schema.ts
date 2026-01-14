import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Podcast {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  guest?: string[];

  @Prop()
  categoryId?: string;

  @Prop()
  converImageUrl?: string;

  @Prop({ unique: true })
  spotifyId?: string;

  @Prop()
  spotifyUrl?: string;

  @Prop()
  publishDate?: Date;

  @Prop()
  durationInMinutes?: number;

  @Prop({ enum: ['DRAFT', 'PUBLISHED'], default: 'DRAFT' })
  status: 'DRAFT' | 'PUBLISHED';
}

export type PodcastDocument = Podcast & Document;
export const PodcastSchema = SchemaFactory.createForClass(Podcast);