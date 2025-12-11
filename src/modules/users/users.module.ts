import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  USERS_REPOSITORY
} from './domain/interfaces/users.repository.interface';
import { UsersMongooseRepository } from './infra/users.repository';
import { User, UserSchema } from './infra/schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './domain/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: USERS_REPOSITORY,
      useClass: UsersMongooseRepository
    }
  ],
  exports: [UsersService, USERS_REPOSITORY]
})
export class UsersModule {}