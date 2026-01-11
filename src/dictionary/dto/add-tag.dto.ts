import { IsNotEmpty, IsString } from 'class-validator';

export class AddTagDto {

    @IsNotEmpty()
    id: string;
    @IsString()
    @IsNotEmpty()
    tag: string;

}
