export const CONTENTS_REPOSITORY = 'CONTENTS_REPOSITORY';

export type ContentType = 'NEWS' | 'ARTICLE';
export type ContentStatus = 'DRAFT' | 'PUBLISHED';

export interface CreateContentInput {
  type: ContentType;
  title: string;
  subtitle?: string;
  slug: string;
  summary?: string;
  body: string;
  coverImageUrl?: string;
  categoryId?: string;
  tags?: string[];
  isCurated: boolean;
  originalSourceUrl?: string;
  originalSourceName?: string;
  authorId?: string;
  status: ContentStatus;
  publishedAt?: Date;
}

export interface ContentsRepository {
  findAll(): Promise<any[]>;
  findBySlug(slug: string): Promise<any | null>;
  create(data: CreateContentInput): Promise<any>;
  update(slug: string, data: Partial<CreateContentInput>): Promise<any>;
}
