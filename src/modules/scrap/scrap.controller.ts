import { Controller, Post } from '@nestjs/common';
import { ScrapService } from './scrap.service';
import { Role } from '../../common/enums/role.enum';
import { Roles } from '../../common/decorators/roles.decorator';
import type { ParsedArticle } from './domain/parsers/parser.interface';

@Controller('scrap')
export class ScrapController {
  constructor(private readonly scrapService: ScrapService) {}

  @Roles(Role.ADMIN)
  @Post('trigger')
  async trigger(): Promise<ParsedArticle[]> {
    return this.scrapService.run();
  }
}
