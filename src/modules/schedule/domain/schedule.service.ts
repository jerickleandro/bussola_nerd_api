import { Inject, Injectable } from '@nestjs/common';
import { SCHEDULE_REPOSITORY } from './interfaces/schedule.repository.interface';
import type {
  CreateScheduleEventInput,
  FindScheduleEventsQuery,
  ScheduleRepository,
} from './interfaces/schedule.repository.interface';
import type { ScheduleEvent } from '../infra/schemas/schedule-event.schema';

@Injectable()
export class ScheduleService {
  constructor(
    @Inject(SCHEDULE_REPOSITORY)
    private readonly scheduleRepository: ScheduleRepository,
  ) {}

  async findAll(query: FindScheduleEventsQuery = {}): Promise<ScheduleEvent[]> {
    return this.scheduleRepository.findAll(query);
  }

  async findBySlug(slug: string): Promise<ScheduleEvent | null> {
    return this.scheduleRepository.findBySlug(slug);
  }

  async findById(id: string): Promise<ScheduleEvent | null> {
    return this.scheduleRepository.findById(id);
  }

  async create(payload: CreateScheduleEventInput): Promise<ScheduleEvent> {
    const slug = payload.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existing = await this.scheduleRepository.findBySlug(slug);
    payload.slug = existing ? `${slug}-${Date.now()}` : slug;

    return this.scheduleRepository.create(payload);
  }

  async update(
    slug: string,
    payload: Partial<CreateScheduleEventInput>,
  ): Promise<ScheduleEvent | null> {
    if (payload.title) {
      const newSlug = payload.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const existing = await this.scheduleRepository.findBySlug(newSlug);
      payload.slug = existing ? `${newSlug}-${Date.now()}` : newSlug;
    }

    return this.scheduleRepository.update(slug, payload);
  }

  async delete(id: string): Promise<ScheduleEvent | null> {
    return this.scheduleRepository.delete(id);
  }
}
