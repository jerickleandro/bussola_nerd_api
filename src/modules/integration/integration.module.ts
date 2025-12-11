import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IntegrationService } from './integration.service';
import { IntegrationController } from './integration.controller';
import { ContentsModule } from '../contents/contents.module';
import {
  LLM_PROVIDER
} from '../../shared/providers/llm/llm.provider.interface';
import { HttpLlmProvider } from '../../shared/providers/llm/llm.provider';

@Module({
  imports: [ConfigModule, ContentsModule],
  controllers: [IntegrationController],
  providers: [
    IntegrationService,
    {
      provide: LLM_PROVIDER,
      useClass: HttpLlmProvider
    }
  ]
})
export class IntegrationModule {}
