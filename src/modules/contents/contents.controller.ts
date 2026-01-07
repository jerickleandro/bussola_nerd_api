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
import { ContentsService } from './domain/contents.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { Role } from '../../common/enums/role.enum';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { FindContentsQueryDto } from './dto/find-contents.query.dto';

@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Public()
  @Get()
  findAll(@Query() query?: FindContentsQueryDto) {
    return this.contentsService.findAll(query);
  }

  @Public()
  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.contentsService.findBySlug(slug);
  }

  @Roles(Role.EDITOR, Role.ADMIN)
  @Post()
  create(@Body() body: CreateContentDto) {
    return this.contentsService.create({
      ...body,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
    });
  }

  @Roles(Role.EDITOR, Role.ADMIN)
  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() body: UpdateContentDto) {
    return this.contentsService.update(slug, {
      ...body,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
    });
  }

  @Roles(Role.ADMIN, Role.EDITOR)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const content = await this.contentsService.findById(id);
    if (!content) {
      return { message: 'Content not found' };
    }
    await this.contentsService.delete(id);
    return { message: 'Content deleted successfully' };
  }
}
