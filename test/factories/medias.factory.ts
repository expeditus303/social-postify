import { SocialMediaPlatform } from '@prisma/client';
import { PrismaService } from '../../src/prisma/prisma.service';
import { generateRandomString } from '../test-utils/generateRandomString.utils';

export async function createMedia(prisma: PrismaService) {

  const platforms = Object.values(SocialMediaPlatform);

  const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];

    const mediaData = {
      title: randomPlatform,
      username: generateRandomString(10),
    };
  
    return await prisma.media.create({
      data: mediaData
    });
  }