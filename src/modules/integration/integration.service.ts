import { Injectable } from '@nestjs/common';

@Injectable()
export class IntegrationService {
  async importNewsFromScrap(payload: any) {
    // aqui no futuro:
    // 1. chamar LLM
    // 2. montar registro em contents
    return { imported: true, rawNews: payload };
  }
}