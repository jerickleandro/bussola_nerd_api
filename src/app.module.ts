import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/validation.schema';
import { appConfig } from './config/app.config';
import { databaseConfig } from './config/database.config';
import { jwtConfig } from './config/jwt.config';
import { spotifyConfig } from './config/spotify.config';
import { releasesConfig } from './config/releases.config';
import { scrapConfig } from './config/scrap.config';
import { llmConfig } from './config/llm.config';

import { DatabaseModule } from './database/database.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        jwtConfig,
        spotifyConfig,
        releasesConfig,
        scrapConfig,
        llmConfig
      ],
      validationSchema,
      validationOptions: {
        abortEarly: false
      }
    }),
    DatabaseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
