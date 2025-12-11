import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsMongoId,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateContentDto {
  @IsIn(['NEWS', 'ARTICLE'])
  type: 'NEWS' | 'ARTICLE';

  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  subtitle?: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  summary?: string;

  @IsString()
  body: string;

  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsBoolean()
  isCurated: boolean;

  @IsOptional()
  @IsUrl()
  originalSourceUrl?: string;

  @IsOptional()
  @IsString()
  originalSourceName?: string;

  @IsOptional()
  @IsMongoId()
  authorId?: string;

  @IsIn(['DRAFT', 'PUBLISHED'])
  status: 'DRAFT' | 'PUBLISHED';

  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}
