import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ScheduleService } from './domain/schedule.service';
import { CreateScheduleEventDto } from './dto/create-schedule-event.dto';
import { UpdateScheduleEventDto } from './dto/update-schedule-event.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import type { FindScheduleEventsQuery } from './domain/interfaces/schedule.repository.interface';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Public()
  @Get()
  findAll(@Query() query?: FindScheduleEventsQuery) {
    return this.scheduleService.findAll(query);
  }

  @Public()
  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.scheduleService.findBySlug(slug);
  }

  @Roles(Role.EDITOR, Role.ADMIN)
  @Post()
  create(@Body() body: CreateScheduleEventDto) {
    return this.scheduleService.create({
      ...body,
      eventDate: new Date(body.eventDate),
    });
  }

  @Roles(Role.EDITOR, Role.ADMIN)
  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() body: UpdateScheduleEventDto) {
    return this.scheduleService.update(slug, {
      ...body,
      eventDate: body.eventDate ? new Date(body.eventDate) : undefined,
    });
  }

  @Roles(Role.EDITOR, Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const event = await this.scheduleService.findById(id);
    if (!event) {
      return { message: 'Event not found' };
    }
    await this.scheduleService.delete(id);
    return { message: 'Event deleted successfully' };
  }
}
