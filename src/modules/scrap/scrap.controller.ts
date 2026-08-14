import { Controller, HttpCode, Post } from '@nestjs/common';
import { ScrapService } from './scrap.service';
import { Role } from '../../common/enums/role.enum';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('scrap')
export class ScrapController {
  constructor(private readonly scrapService: ScrapService) {}

  @Roles(Role.ADMIN)
  @Post('trigger')
  @HttpCode(200)
  async trigger() {
    await this.scrapService.run();
    return { success: true };
  }
}
