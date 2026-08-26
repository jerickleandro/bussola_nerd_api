import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateScheduleEventInput,
  FindScheduleEventsQuery,
  ScheduleRepository,
} from '../domain/interfaces/schedule.repository.interface';
import {
  ScheduleEvent,
  ScheduleEventDocument,
} from './schemas/schedule-event.schema';

@Injectable()
export class ScheduleMongooseRepository implements ScheduleRepository {
  constructor(
    @InjectModel(ScheduleEvent.name)
    private readonly model: Model<ScheduleEventDocument>,
  ) {}

  async findAll(query: FindScheduleEventsQuery = {}): Promise<ScheduleEvent[]> {
    const filter: Record<string, unknown> = {};

    if (query.eventType) {
      filter.eventType = query.eventType;
    }

    const limit = Math.min(Math.max(query.limit ?? 20, 1), 50);
    const page = Math.max(query.page ?? 1, 1);
    const skip = (page - 1) * limit;

    return this.model
      .find(filter)
      .sort({ eventDate: 1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
  }

  async findBySlug(slug: string): Promise<ScheduleEvent | null> {
    return this.model.findOne({ slug }).lean().exec();
  }

  async findById(id: string): Promise<ScheduleEvent | null> {
    return this.model.findById(id).lean().exec();
  }

  async create(data: CreateScheduleEventInput): Promise<ScheduleEvent> {
    const created = new this.model(data);
    return created.save();
  }

  async update(
    slug: string,
    data: Partial<CreateScheduleEventInput>,
  ): Promise<ScheduleEvent | null> {
    return this.model
      .findOneAndUpdate({ slug }, data, { new: true })
      .lean()
      .exec();
  }

  async delete(id: string): Promise<ScheduleEvent | null> {
    return this.model.findOneAndDelete({ _id: id }).lean().exec();
  }
}
