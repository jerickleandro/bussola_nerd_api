import {
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateScheduleEventDto {
  @IsIn(['ANIME', 'LIVE', 'EPISODE', 'VIDEO'])
  eventType: 'ANIME' | 'LIVE' | 'EPISODE' | 'VIDEO';

  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  eventDate: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
