import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateDictionaryDto {
    @IsString()
    @IsNotEmpty()
    name: string;


    @IsObject()
    entries: Record<string, string[]>;
}