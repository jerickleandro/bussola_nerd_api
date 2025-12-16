import { User } from '../../infra/schemas/user.schema';

export const USERS_REPOSITORY = 'USERS_REPOSITORY';

export interface UsersRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: {
    name: string;
    email: string;
    passwordHash: string;
    role: string;
  }): Promise<User>;
  update(
    id: string,
    updateData: Partial<{
      name: string;
      email: string;
      role: string;
      avatarUrl: string;
      bio: string;
      active: boolean;
    }>,
  ): Promise<User | null>;
}
