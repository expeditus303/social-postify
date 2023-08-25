import { SocialMediaPlatform } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateMediaDto {
  @IsString()
  @IsEnum(SocialMediaPlatform)
  @IsNotEmpty()
  title: SocialMediaPlatform;

  @IsString()
  @IsNotEmpty()
  username: string;
}
