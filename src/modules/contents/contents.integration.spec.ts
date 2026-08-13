import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import request from 'supertest';
import { Reflector } from '@nestjs/core';
import { APP_GUARD } from '@nestjs/core';

import { ContentsController } from './contents.controller';
import { ContentsService } from './domain/contents.service';
import { CONTENTS_REPOSITORY } from './domain/interfaces/contents.repository.interface';
import { CategoriesService } from '../categories/domain/categories.service';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';

@Injectable()
class MockAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    request.user = {
      userId: 'mock-user-id',
      email: 'editor@test.com',
      role: 'EDITOR',
    };
    return true;
  }
}

describe('Contents — Integration', () => {
  let app: INestApplication;
  let mockRepository: Record<string, jest.Mock>;
  let mockCategoriesService: Record<string, jest.Mock>;

  const validPayload = {
    type: 'NEWS',
    title: 'Test News',
    slug: 'test-news',
    body: 'Body content',
    isCurated: false,
    status: 'PUBLISHED',
  };

  beforeAll(async () => {
    mockRepository = {
      findAll: jest.fn(),
      findBySlug: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockCategoriesService = {
      findBySlug: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentsController],
      providers: [
        ContentsService,
        { provide: CONTENTS_REPOSITORY, useValue: mockRepository },
        { provide: CategoriesService, useValue: mockCategoriesService },
        { provide: APP_GUARD, useClass: MockAuthGuard },
        Reflector,
      ],
    }).compile();

    app = module.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/v1/contents', () => {
    it('should return empty list', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const res = await request(app.getHttpServer()).get('/api/v1/contents');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return contents with data', async () => {
      const content = { _id: '1', ...validPayload };
      mockRepository.findAll.mockResolvedValue([content]);

      const res = await request(app.getHttpServer()).get('/api/v1/contents');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([content]);
    });

    it('should filter by type', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      await request(app.getHttpServer())
        .get('/api/v1/contents')
        .query({ type: 'NEWS' });

      expect(mockRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'NEWS' }),
      );
    });

    it('should filter by categories slug', async () => {
      mockCategoriesService.findBySlug.mockResolvedValue({
        _id: 'cat-id-123',
        isActive: true,
      });
      mockRepository.findAll.mockResolvedValue([]);

      await request(app.getHttpServer())
        .get('/api/v1/contents')
        .query({ categories: 'games' });

      expect(mockCategoriesService.findBySlug).toHaveBeenCalledWith('games');
      expect(mockRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ category: 'cat-id-123' }),
      );
    });

    it('should return empty array if category not found', async () => {
      mockCategoriesService.findBySlug.mockResolvedValue(null);

      const res = await request(app.getHttpServer())
        .get('/api/v1/contents')
        .query({ categories: 'unknown' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
      expect(mockRepository.findAll).not.toHaveBeenCalled();
    });

    it('should return empty array if category is inactive', async () => {
      mockCategoriesService.findBySlug.mockResolvedValue({
        _id: 'cat-id',
        isActive: false,
      });

      const res = await request(app.getHttpServer())
        .get('/api/v1/contents')
        .query({ categories: 'games' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
      expect(mockRepository.findAll).not.toHaveBeenCalled();
    });

    it('should pass page and limit to repository', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      await request(app.getHttpServer())
        .get('/api/v1/contents')
        .query({ page: '2', limit: '5' });

      expect(mockRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2, limit: 5 }),
      );
    });
  });

  describe('GET /api/v1/contents/:slug', () => {
    it('should return content by slug', async () => {
      const content = { _id: '1', ...validPayload };
      mockRepository.findBySlug.mockResolvedValue(content);

      const res = await request(app.getHttpServer()).get(
        '/api/v1/contents/test-news',
      );

      expect(res.status).toBe(200);
      expect(res.body).toEqual(content);
      expect(mockRepository.findBySlug).toHaveBeenCalledWith('test-news');
    });

    it('should return null if slug does not exist', async () => {
      mockRepository.findBySlug.mockResolvedValue(null);

      const res = await request(app.getHttpServer()).get(
        '/api/v1/contents/nonexistent',
      );

      expect(res.status).toBe(200);
      expect(res.body).toEqual({});
    });
  });

  describe('POST /api/v1/contents', () => {
    it('should create content with valid payload', async () => {
      const created = { _id: '1', ...validPayload };
      mockRepository.findBySlug.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(created);

      const res = await request(app.getHttpServer())
        .post('/api/v1/contents')
        .send(validPayload);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(created);
      expect(mockRepository.findBySlug).toHaveBeenCalledWith('test-news');
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ slug: 'test-news' }),
      );
    });

    it('should generate unique slug on collision', async () => {
      const now = 1234567890;
      jest.spyOn(Date, 'now').mockReturnValue(now);

      mockRepository.findBySlug.mockResolvedValue({
        _id: 'existing',
        slug: 'test-news',
      });

      const created = {
        _id: '2',
        ...validPayload,
        slug: `test-news-${now}`,
      };
      mockRepository.create.mockResolvedValue(created);

      const res = await request(app.getHttpServer())
        .post('/api/v1/contents')
        .send(validPayload);

      expect(res.status).toBe(201);
      expect(res.body.slug).toBe(`test-news-${now}`);
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ slug: `test-news-${now}` }),
      );

      jest.restoreAllMocks();
    });

    it('should reject payload missing required fields', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/contents')
        .send({});

      expect(res.status).toBe(400);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should reject invalid type', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/contents')
        .send({ ...validPayload, type: 'INVALID' });

      expect(res.status).toBe(400);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should reject extra fields not in DTO', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/contents')
        .send({ ...validPayload, extraField: 'should-not-pass' });

      expect(res.status).toBe(400);
    });
  });

  describe('PATCH /api/v1/contents/:slug', () => {
    it('should update existing content', async () => {
      const updated = { _id: '1', ...validPayload, title: 'Updated Title' };
      mockRepository.update.mockResolvedValue(updated);

      const res = await request(app.getHttpServer())
        .patch('/api/v1/contents/test-news')
        .send({ title: 'Updated Title' });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated Title');
      expect(mockRepository.update).toHaveBeenCalledWith('test-news', {
        title: 'Updated Title',
      });
    });

    it('should return null if slug does not exist', async () => {
      mockRepository.update.mockResolvedValue(null);

      const res = await request(app.getHttpServer())
        .patch('/api/v1/contents/nonexistent')
        .send({ title: 'Updated' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({});
    });
  });

  describe('DELETE /api/v1/contents/:id', () => {
    it('should delete existing content', async () => {
      const existing = { _id: 'content-id' };
      mockRepository.findById.mockResolvedValue(existing);
      mockRepository.delete.mockResolvedValue(existing);

      const res = await request(app.getHttpServer()).delete(
        '/api/v1/contents/content-id',
      );

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Content deleted successfully' });
      expect(mockRepository.findById).toHaveBeenCalledWith('content-id');
      expect(mockRepository.delete).toHaveBeenCalledWith('content-id');
    });

    it('should return not found if id does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const res = await request(app.getHttpServer()).delete(
        '/api/v1/contents/nonexistent-id',
      );

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Content not found' });
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });
  });
});
