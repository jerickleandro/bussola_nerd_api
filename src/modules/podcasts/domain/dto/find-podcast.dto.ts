import { Transform } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class FindPodcastDto {
    @IsOptional()
    @IsString()
    categories?: string;

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