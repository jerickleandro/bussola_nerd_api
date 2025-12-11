import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { ImportNewsDto } from './dto/import-news.dto';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { Public } from '../../common/decorators/public.decorator';

@Controller('internal')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Public() // não exige JWT
  @UseGuards(ApiKeyGuard) // mas exige API key
  @Post('import/news')
  importNews(@Body() body: ImportNewsDto) {
    return this.integrationService.importNewsFromScrap(body);
  }
}
