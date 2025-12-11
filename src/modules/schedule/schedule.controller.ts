import { Controller, Get, Post, Body } from '@nestjs/common';
import { ScheduleService } from './schedule.service';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('upcoming')
  listUpcoming() {
    return this.scheduleService.listUpcoming();
  }

  @Post()
  create(@Body() body: any) {
    return this.scheduleService.create(body);
  }
}