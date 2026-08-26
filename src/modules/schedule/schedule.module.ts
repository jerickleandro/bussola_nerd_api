import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './domain/schedule.service';
import { SCHEDULE_REPOSITORY } from './domain/interfaces/schedule.repository.interface';
import { ScheduleMongooseRepository } from './infra/schedule.repository';
import {
  ScheduleEvent,
  ScheduleEventSchema,
} from './infra/schemas/schedule-event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ScheduleEvent.name, schema: ScheduleEventSchema },
    ]),
  ],
  controllers: [ScheduleController],
  providers: [
    ScheduleService,
    {
      provide: SCHEDULE_REPOSITORY,
      useClass: ScheduleMongooseRepository,
    },
  ],
  exports: [ScheduleService, SCHEDULE_REPOSITORY],
})
export class ScheduleModule {}
