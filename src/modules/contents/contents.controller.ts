import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ContentsService } from './contents.service';


@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Get()
  findAll() {
    return this.contentsService.findAll();
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.contentsService.findBySlug(slug);
  }

  @Post()
  create(@Body() body: any) {
    return this.contentsService.create(body);
  }
}
