import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly expectedKey: string;

  constructor(private readonly configService: ConfigService) {
    const scrapConfig = this.configService.get('scrap');
    this.expectedKey = scrapConfig.apiKey;
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'] || request.headers['X-API-KEY'];

    if (!apiKey || apiKey !== this.expectedKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
