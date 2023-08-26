// import { INestApplication } from '@nestjs/common';
// import { CreateMediaDto } from 'src/medias/dto/create-media.dto';
// import * as request from 'supertest';

// export async function createMedia(app: INestApplication, data: CreateMediaDto) {
//   return await request(app.getHttpServer()).post('/medias').send(data);
// }

import { SocialMediaPlatform } from '@prisma/client';
import { PrismaService } from '../../src/prisma/prisma.service';
import { generateRandomString } from '../utils/generateRandomString';

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