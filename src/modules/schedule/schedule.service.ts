import { Injectable } from '@nestjs/common';

@Injectable()
export class ScheduleService {
  async listUpcoming() {
    return [];
  }

  async create(payload: any) {
    return payload;
  }
}