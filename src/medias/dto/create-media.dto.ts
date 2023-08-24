import { SocialMediaPlatform } from "@prisma/client";
import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateMediaDto {
    @IsString()
    @IsNotEmpty()
    title: SocialMediaPlatform

    @IsString()
    @IsNotEmpty()
    username: string 
}
