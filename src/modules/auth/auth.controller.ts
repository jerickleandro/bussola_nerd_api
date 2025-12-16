import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);

    if (!user) {
      // ideal: lançar UnauthorizedException
      return { error: 'Credenciais inválidas' };
    }

    return this.authService.login(user);
  }

  @Roles(Role.EDITOR, Role.ADMIN)
  @Get('me')
  async me(@Headers() headers: any) {
    const token = headers.authorization?.replace('Bearer ', '');
    return this.authService.getProfile(token);
  }
}
