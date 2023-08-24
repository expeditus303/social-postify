import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateMediaDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsUrl({}, {message: '$property must be a valid URL' })
    @IsNotEmpty()
    username: string 
}
