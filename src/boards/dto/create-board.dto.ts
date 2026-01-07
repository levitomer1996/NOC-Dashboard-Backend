import { IsString, IsBoolean, IsOptional, IsArray } from 'class-validator';

export class CreateBoardDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;

    @IsOptional()
    @IsArray()
    environments?: string[];

    @IsOptional()
    @IsArray()
    metrics?: string[];
}
