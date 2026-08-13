import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IntegrationService } from './integration.service';
import { IntegrationController } from './integration.controller';
import { ContentsModule } from '../contents/contents.module';
import { LlmModule } from '../../shared/providers/llm/llm.module';

@Module({
  imports: [ConfigModule, ContentsModule, LlmModule],
  controllers: [IntegrationController],
  providers: [IntegrationService],
})
export class IntegrationModule {}
