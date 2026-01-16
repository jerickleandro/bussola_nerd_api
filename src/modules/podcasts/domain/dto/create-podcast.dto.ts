import {
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
/*
title
description
guest
categoryId
coverImageUrl
spotifyId
spotifyUrl
publishDate
durationInMinutes
status
*/
export class CreatePodcastDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  guest?: string[];

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @IsOptional()
  @IsString()
  spotifyId?: string;

  @IsOptional()
  @IsUrl()
  spotifyUrl?: string;

  @IsOptional()
  publishDate?: Date;

  @IsOptional()
  durationInMinutes?: number;

  @IsString()
  status: 'DRAFT' | 'PUBLISHED';
}
