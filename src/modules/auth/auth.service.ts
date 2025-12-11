import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  // valida credenciais do usuário
  async validateUser(email: string, plainPassword: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.passwordHash) return null;

    const isPasswordValid = await bcrypt.compare(
      plainPassword,
      user.passwordHash
    );
    if (!isPasswordValid) return null;

    // não retornar o hash
    const { passwordHash, ...result } = user.toObject();
    return result;
  }

  async login(user: any) {
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role
    };

    return {
      accessToken: this.jwtService.sign(payload)
    };
  }
}