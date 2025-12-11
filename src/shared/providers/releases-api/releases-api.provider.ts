import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ReleasesApiProvider
} from './releases-api.provider.interface';

@Injectable()
export class HttpReleasesApiProvider implements ReleasesApiProvider {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    const cfg = this.configService.get('releasesApi');
    this.baseUrl = cfg.baseUrl;
    this.apiKey = cfg.apiKey;
  }

  async fetchReleasesByMonth(params: {
    year: number;
    month: number;
  }): Promise<any[]> {
    // TODO: implementar chamada HTTP real
    return [];
  }
}