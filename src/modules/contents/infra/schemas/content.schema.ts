import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Content {
  @Prop({ required: true, enum: ['NEWS', 'ARTICLE'] })
  type: 'NEWS' | 'ARTICLE';

  @Prop({ required: true })
  title: string;

  @Prop()
  subtitle?: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  summary?: string;

  @Prop({ required: true })
  body: string;

  @Prop()
  coverImageUrl?: string;

  @Prop()
  categoryId?: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: false })
  isCurated: boolean;

  @Prop({ unique: true, sparse: true })
  originalSourceUrl?: string;

  @Prop()
  originalSourceName?: string;

  @Prop()
  authorId?: string;

  @Prop({ enum: ['DRAFT', 'PUBLISHED'], default: 'DRAFT' })
  status: 'DRAFT' | 'PUBLISHED';

  @Prop()
  publishedAt?: Date;
}

export type ContentDocument = Content & Document;
export const ContentSchema = SchemaFactory.createForClass(Content);
