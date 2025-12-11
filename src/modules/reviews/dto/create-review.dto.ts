import { IsIn, IsNumber, IsString } from "class-validator";

export class CreateReviewDto {
    
    @IsString()
    title: string;

    @IsNumber()
    rating: number;

    @IsIn(['FILME', 'SERIE', 'GAME', 'LIVRO'])
    type: 'FILME' | 'SERIE' | 'GAME' | 'LIVRO';
}