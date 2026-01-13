import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export enum ContentTypeQuery {
  NEWS = 'NEWS',
  ARTICLE = 'ARTICLE',
}

export class FindContentsQueryDto {
  @IsOptional()
  @IsString()
  categories?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(ContentTypeQuery)
  type?: ContentTypeQuery;

  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : 1))
  @IsInt()
  @Min(1)
  page?: number;

  // opcional, mas útil (pode remover se não quiser expor)
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : 10))
  @IsInt()
  @Min(1)
  limit?: number;
}
