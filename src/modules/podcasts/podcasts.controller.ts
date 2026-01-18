import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PodcastsService } from './domain/podcasts.service';
import { CreatePodcastDto } from './domain/dto/create-podcast.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('podcasts')
export class PodcastsController {
  constructor(private readonly podcastsService: PodcastsService) { }

  @Public()
  @Get('episodes')
  listEpisodes(@Query() query?: any) {
    return this.podcastsService.listEpisodes(query);
  }

  @Public()
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.podcastsService.findById(id);
  }

  @Roles(Role.EDITOR, Role.ADMIN)
  @Post('create')
  create(@Body() body: CreatePodcastDto) {
    return this.podcastsService.create(body);
  }

  @Roles(Role.EDITOR, Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Partial<CreatePodcastDto>) {
    return this.podcastsService.update(id, body);
  }

  @Roles(Role.EDITOR, Role.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.podcastsService.delete(id);
  }
}
