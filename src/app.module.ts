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
import { APP_GUARD } from '@nestjs/core';

import { DatabaseModule } from './database/database.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ContentsModule } from './modules/contents/contents.module';
import { PodcastsModule } from './modules/podcasts/podcasts.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ReleasesModule } from './modules/releases/releases.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { IntegrationModule } from './modules/integration/integration.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
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
    DatabaseModule,
    HealthModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    ContentsModule,
    PodcastsModule,
    ReviewsModule,
    ReleasesModule,
    ScheduleModule,
    IntegrationModule
  ],
  controllers: [AppController],
  providers: [AppService,{
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }],
})
export class AppModule {}
