import { Inject, Injectable } from '@nestjs/common';
import { CONTENTS_REPOSITORY } from './interfaces/contents.repository.interface';
import type { ContentsRepository, CreateContentInput } from './interfaces/contents.repository.interface';

@Injectable()
export class ContentsService {
  constructor(
    @Inject(CONTENTS_REPOSITORY)
    private readonly contentsRepository: ContentsRepository
  ) {}

  async findAll() {
    return this.contentsRepository.findAll();
  }

  async findBySlug(slug: string) {
    return this.contentsRepository.findBySlug(slug);
  }

  async create(payload: CreateContentInput) {
    // aqui podem entrar regras como:
    // - gerar slug
    // - validar campos
    return this.contentsRepository.create(payload);
  }
}
