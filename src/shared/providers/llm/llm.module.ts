import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiGateway } from './ai-gateway';
import { OpenRouterProvider } from './openrouter.provider';
import { LLM_PROVIDER } from './llm.provider.interface';

@Module({
  providers: [
    OpenRouterProvider,
    {
      provide: LLM_PROVIDER,
      useFactory: (
        openRouterProvider: OpenRouterProvider,
        configService: ConfigService,
      ) =>
        new AiGateway(
          [{ name: 'openrouter', provider: openRouterProvider }],
          configService,
        ),
      inject: [OpenRouterProvider, ConfigService],
    },
  ],
  exports: [LLM_PROVIDER],
})
export class LlmModule {}
