import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ScrapedArticle {
  @Prop({ required: true })
  portal: string;

  @Prop({ required: true, unique: true })
  url: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ unique: true, sparse: true })
  guid?: string;

  @Prop()
  imageUrl?: string;

  @Prop()
  summary?: string;

  @Prop({ default: false })
  processed: boolean;

  @Prop()
  contentId?: string;

  @Prop()
  error?: string;
}

export type ScrapedArticleDocument = ScrapedArticle & Document;
export const ScrapedArticleSchema =
  SchemaFactory.createForClass(ScrapedArticle);
