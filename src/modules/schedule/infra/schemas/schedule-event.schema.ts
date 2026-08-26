import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ScheduleEventDocument = ScheduleEvent & Document;

@Schema({ timestamps: true })
export class ScheduleEvent {
  @Prop({ required: true, enum: ['ANIME', 'LIVE', 'EPISODE', 'VIDEO'] })
  eventType: 'ANIME' | 'LIVE' | 'EPISODE' | 'VIDEO';

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  eventDate: Date;

  @Prop()
  imageUrl?: string;

  @Prop({ required: true, unique: true })
  slug: string;
}

export const ScheduleEventSchema = SchemaFactory.createForClass(ScheduleEvent);
