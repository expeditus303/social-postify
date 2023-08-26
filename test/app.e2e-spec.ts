import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { createMedia } from './factories/medias.factory';
import { generateRandomString } from './utils/generateRandomString';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    prisma = moduleFixture.get(PrismaService);

    await prisma.publication.deleteMany();
    await prisma.post.deleteMany();
    await prisma.media.deleteMany();

    await app.init();
  });

  it('/health (GET)', async () => {
    const { status, text } = await request(app.getHttpServer()).get('/health');
    expect(status).toBe(HttpStatus.OK);
    expect(text).toBe('I’m okay!');
  });

  describe('/Medias CRUD', () => {
    it('/medias (POST) => should create a new media', async () => {
      const mediaData = {
        title: 'Twitter',
        username: 'elonmusk',
      };

      const { statusCode, body } = await request(app.getHttpServer())
        .post('/medias')
        .send(mediaData);

      expect(statusCode).toBe(HttpStatus.CREATED);
      expect(body).toMatchObject({
        id: expect.any(Number),
        title: mediaData.title,
        username: mediaData.username,
      });
    });

    it('/medias (GET) => should get all medias', async () => {
      const media1 = await createMedia(prisma);

      const media2 = await createMedia(prisma);

      const { statusCode, body } = await request(app.getHttpServer()).get(
        '/medias',
      );

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: media1.id,
            title: media1.title,
            username: media1.username,
          }),
          expect.objectContaining({
            id: media2.id,
            title: media2.title,
            username: media2.username,
          }),
        ]),
      );
    });

    it('/medias/:id (GET) => should get media by id', async () => {
      const media = await createMedia(prisma);

      const { statusCode, body } = await request(app.getHttpServer()).get(
        `/medias/${media.id}`,
      );

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body).toMatchObject({
        id: media.id,
        title: media.title,
        username: media.username,
      });
    });

    it('/medias (PUT) => should update media by id', async () => {
      const media = await createMedia(prisma);

      const updatedMedia = {
        title: 'Instagram',
        username: generateRandomString(10)
      }

      const { statusCode, body } = await request(app.getHttpServer()).put(
        `/medias/${media.id}`).send(updatedMedia)

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body).toMatchObject({
        id: media.id,
        title: updatedMedia.title,
        username: updatedMedia.username,
      });
    });

    it('/medias (DELETE) => should delete media by id', async () => {
      const media = await createMedia(prisma);

      const { statusCode: statusCodeMediaExists } = await request(app.getHttpServer()).get(
        `/medias/${media.id}`,
      );

      expect(statusCodeMediaExists).toBe(HttpStatus.OK);

      await request(app.getHttpServer()).delete(
        `/medias/${media.id}`)

        const { statusCode } = await request(app.getHttpServer()).get(
          `/medias/${media.id}`,
        );

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
