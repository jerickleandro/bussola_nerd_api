import { Optional } from "@nestjs/common";
import { IsArray, IsIn, IsNumber, IsString } from "class-validator";

type Scores = {
    score: number;
    userId: string;
}

export class CreateReviewDto {
    
    @IsString()
    title: string;

    @IsArray()
    scores: Scores[];

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

    @Optional()
    @IsArray()
    @IsString({ each: true })
    cast: string[];

    @Optional()
    @IsString()
    director?: string;

    @Optional()
    @IsString()
    author?: string;

    @Optional()
    @IsString()
    publisher?: string;

    @IsString()
    review: string; 
}
