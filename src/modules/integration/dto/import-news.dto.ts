import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';

export class ImportNewsDto {
  @IsString()
  title: string;

  @IsString()
  text: string;

  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  sourceName?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
