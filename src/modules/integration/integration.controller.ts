import { Body, Controller, Headers, Post } from '@nestjs/common';
import { IntegrationService } from './integration.service';

@Controller('internal')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Post('import/news')
  importNews(
    @Headers('x-api-key') apiKey: string,
    @Body()
    body: {
      title: string;
      text: string;
      url: string;
      sourceName?: string;
      tags?: string[];
    }
  ) {
    return this.integrationService.importNewsFromScrap(apiKey, body);
  }
}
