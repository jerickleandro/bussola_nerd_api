import { ArrayMinSize, IsArray, IsIn, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ScoreDto } from './score-review.dto';
import { Type } from 'class-transformer';


export class CreateReviewDto {
  @IsString()
  title: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ScoreDto)
  scores: ScoreDto[];

  @IsIn(['FILME', 'SERIE', 'GAME', 'LIVRO'])
  type: 'FILME' | 'SERIE' | 'GAME' | 'LIVRO';

  @IsNumber()
  year: number;

  @IsArray()
  @IsString({ each: true })
  genres: string[];

  @IsArray()
  @IsString({ each: true })
  platforms: string[];

  @IsString()
  synopsis: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cast?: string[];

  @IsOptional()
  @IsString()
  director?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsString()
  review: string;

  @IsOptional()
  @IsString()
  urlPodcastEpisode?: string;

  @IsOptional()
  @IsString()
  urlIdPodcastEpisode?: string;
}
