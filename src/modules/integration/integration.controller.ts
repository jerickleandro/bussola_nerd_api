import { Controller, Post, Body, Headers } from '@nestjs/common';
import { IntegrationService } from './integration.service';

@Controller('internal')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Post('import/news')
  importNews(
    @Body() body: any,
    @Headers('x-api-key') apiKey: string
  ) {
    // futuramente: validar apiKey (SCRAP_API_KEY)
    return this.integrationService.importNewsFromScrap(body);
  }
}