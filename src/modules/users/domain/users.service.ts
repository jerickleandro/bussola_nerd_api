import * as bcrypt from 'bcrypt';
import { Inject, Injectable } from '@nestjs/common';
import { USERS_REPOSITORY } from './interfaces/users.repository.interface';
import type { UsersRepository } from './interfaces/users.repository.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  async findAll() {
    return this.usersRepository.findAll();
  }

  async findById(id: string) {
    return this.usersRepository.findById(id);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async create(payload: {
    name: string;
    email: string;
    passwordHash: string;
    role: string;
  }) {
    return this.usersRepository.create(payload);
  }

  async createWithPlainPassword(
    userData: Omit<
      {
        name: string;
        email: string;
        passwordHash: string;
        role: string;
      },
      'passwordHash'
    >,
    plainPassword: string,
  ) {
    const passwordHash = await bcrypt.hash(plainPassword, 10);
    return this.usersRepository.create({
      ...userData,
      passwordHash,
    });
  }
}
