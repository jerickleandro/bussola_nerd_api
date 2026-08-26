import type { ScheduleEvent } from '../../infra/schemas/schedule-event.schema';

export const SCHEDULE_REPOSITORY = 'SCHEDULE_REPOSITORY';

export type ScheduleEventType = 'ANIME' | 'LIVE' | 'EPISODE' | 'VIDEO';

export interface CreateScheduleEventInput {
  eventType: ScheduleEventType;
  title: string;
  description: string;
  eventDate: Date;
  imageUrl?: string;
  slug?: string;
}

export interface FindScheduleEventsQuery {
  eventType?: ScheduleEventType;
  page?: number;
  limit?: number;
}

export interface ScheduleRepository {
  findAll(query?: FindScheduleEventsQuery): Promise<ScheduleEvent[]>;
  findBySlug(slug: string): Promise<ScheduleEvent | null>;
  findById(id: string): Promise<ScheduleEvent | null>;
  create(data: CreateScheduleEventInput): Promise<ScheduleEvent>;
  update(
    slug: string,
    data: Partial<CreateScheduleEventInput>,
  ): Promise<ScheduleEvent | null>;
  delete(id: string): Promise<ScheduleEvent | null>;
}
