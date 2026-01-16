import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { PodcastsService } from './domain/podcasts.service';
import { CreatePodcastDto } from './domain/dto/create-podcast.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('podcasts')
export class PodcastsController {
  constructor(private readonly podcastsService: PodcastsService) {}

  @Public()
  @Get('episodes')
  listEpisodes() {
    return this.podcastsService.listEpisodes();
  }

  @Roles(Role.EDITOR, Role.ADMIN)
  @Post('create')
  create(@Body() body: CreatePodcastDto) {
    return this.podcastsService.create(body);
  }

  // @Roles(Role.EDITOR, Role.ADMIN)
  // @Patch('update/:id')
  // update(@Body() body: Partial<CreatePodcastDto>, ) {
  //   const id = body.id;
  //   delete body.id;
  //   return this.podcastsService.update(id, body);
  // }
}
