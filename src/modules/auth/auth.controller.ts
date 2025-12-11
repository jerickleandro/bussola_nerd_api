import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { email: string; password: string }
  ) {
    // futuramente: usar DTO com class-validator
    const user = await this.authService.validateUser(
      body.email,
      body.password
    );

    if (!user) {
      // você pode lançar UnauthorizedException aqui
      return { error: 'Credenciais inválidas' };
    }

    return this.authService.login(user);
  }
}