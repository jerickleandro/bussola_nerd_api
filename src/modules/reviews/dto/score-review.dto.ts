import { IsNumber, IsString } from 'class-validator';

export class ScoreDto {
  @IsNumber()
  score: number;

  @IsString()
  userId: string;
}
