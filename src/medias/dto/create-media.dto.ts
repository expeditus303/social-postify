import { SocialMediaPlatform } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMediaDto {
  @IsString()
  @IsNotEmpty()
  title: SocialMediaPlatform;

  @IsString()
  @IsNotEmpty()
  username: string;
}
