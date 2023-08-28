import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { createMedia } from './factories/medias.factory';
import { generateRandomString } from './test-utils/generateRandomString.utils';
import { createPost } from './factories/posts.factory';
import { cleanDatabase } from './test-utils/prisma.utils';
import { createPublication } from './factories/publications.factory';
import { generateRandomFutureDate } from './test-utils/genrerateRandomDate';

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

    await cleanDatabase(prisma);

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
        username: generateRandomString(10),
      };

      const { statusCode, body } = await request(app.getHttpServer())
        .put(`/medias/${media.id}`)
        .send(updatedMedia);

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body).toMatchObject({
        id: media.id,
        title: updatedMedia.title,
        username: updatedMedia.username,
      });
    });

    it('/medias (DELETE) => should delete media by id', async () => {
      const media = await createMedia(prisma);

      const { statusCode: statusCodeMediaExists } = await request(
        app.getHttpServer(),
      ).get(`/medias/${media.id}`);

      await request(app.getHttpServer()).delete(`/medias/${media.id}`);

      const { statusCode } = await request(app.getHttpServer()).get(
        `/medias/${media.id}`,
      );

      expect(statusCodeMediaExists).toBe(HttpStatus.OK);
      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('/Posts CRUD', () => {
    it('/posts (POST) => should create a new post with image', async () => {
      const postData = {
        title: 'Pepe de Frog',
        text: 'why rigth-wing love him?',
        image:
          'https://www.rollingstone.com/wp-content/uploads/2020/07/Screen-Shot-2020-07-15-at-11.24.37-AM.jpg',
      };

      const { statusCode, body } = await request(app.getHttpServer())
        .post('/posts')
        .send(postData);

      expect(statusCode).toBe(HttpStatus.CREATED);
      expect(body).toMatchObject({
        id: expect.any(Number),
        title: postData.title,
        text: postData.text,
        image: postData.image,
      });
    });

    it('/posts (GET) => should get all posts', async () => {
      const post1 = await createPost(prisma);

      const post2 = await createPost(prisma);

      const { statusCode, body } = await request(app.getHttpServer()).get(
        '/posts',
      );

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: post1.id,
            title: post1.title,
            text: post1.text,
            image: post1.image,
          }),
          expect.objectContaining({
            id: post2.id,
            title: post2.title,
            text: post2.text,
            image: post2.image,
          }),
        ]),
      );
    });

    it('/posts/:id (GET) => should get post by id', async () => {
      const post = await createPost(prisma);

      const { statusCode, body } = await request(app.getHttpServer()).get(
        `/posts/${post.id}`,
      );

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body).toMatchObject({
        id: post.id,
        title: post.title,
        text: post.text,
        image: post.image,
      });
    });

    it('/posts (PUT) => should update a post by id', async () => {
      const post = await createPost(prisma);

      const updatedPostWithNoImage = {
        title: generateRandomString(10),
        text: generateRandomString(12),
      };

      const { statusCode, body } = await request(app.getHttpServer())
        .put(`/posts/${post.id}`)
        .send(updatedPostWithNoImage);

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body).toMatchObject({
        id: post.id,
        title: updatedPostWithNoImage.title,
        text: updatedPostWithNoImage.text,
        image: null,
      });
    });

    it('/posts (DELETE) => should delete a post by id', async () => {
      const post = await createPost(prisma);

      const { statusCode: statusCodePostExists } = await request(
        app.getHttpServer(),
      ).get(`/posts/${post.id}`);

      await request(app.getHttpServer()).delete(`/posts/${post.id}`);

      const { statusCode } = await request(app.getHttpServer()).get(
        `/posts/${post.id}`,
      );

      expect(statusCodePostExists).toBe(HttpStatus.OK);
      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('/Publications CRUD', () => {
    it('/publications (POST) => should create a new publication', async () => {
      const media = await createMedia(prisma);
      const post = await createPost(prisma);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const formattedDate = tomorrow.toISOString();

      const publication = {
        mediaId: media.id,
        postId: post.id,
        date: formattedDate,
      };

      const { statusCode, body } = await request(app.getHttpServer())
        .post('/publications')
        .send(publication);

      expect(statusCode).toBe(HttpStatus.CREATED);
      expect(body).toMatchObject({
        id: expect.any(Number),
        mediaId: publication.mediaId,
        postId: publication.postId,
        date: publication.date,
      });
    });

    it('/publications (GET) => should get all publications', async () => {
      const publication1 = await createPublication(prisma);
      const publication2 = await createPublication(prisma);

      const { statusCode, body } = await request(app.getHttpServer()).get(
        '/publications',
      );

      expect(statusCode).toBe(HttpStatus.OK);

      console.log('Publication 1:', publication1);
      console.log('Publication 2:', publication2);
      console.log('Received body:', body);

      expect(body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: publication1.id,
            mediaId: publication1.mediaId,
            postId: publication1.postId,
            date: publication1.date.toISOString(),
          }),
          expect.objectContaining({
            id: publication2.id,
            mediaId: publication2.mediaId,
            postId: publication2.postId,
            date: publication2.date.toISOString(),
          }),
        ]),
      );
    });

    it('/publications/:id (GET) => should get publication by id', async () => {
      const publication = await createPublication(prisma);

      const { statusCode, body } = await request(app.getHttpServer()).get(
        `/publications/${publication.id}`,
      );

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body).toMatchObject({
        id: publication.id,
        mediaId: publication.mediaId,
        postId: publication.postId,
        date: publication.date.toISOString(),
      });
    });

    it('/publications (PUT) => should update a publication by id', async () => {
      const publication = await createPublication(prisma);

      const updatedPublication = {
        mediaId: publication.mediaId,
        postId: publication.postId,
        date: generateRandomFutureDate(365)
      };

      const { statusCode, body } = await request(app.getHttpServer())
        .put(`/publications/${publication.id}`)
        .send(updatedPublication);

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body).toMatchObject({
        id: publication.id,
        mediaId: updatedPublication.mediaId,
        postId: updatedPublication.postId,
        date: updatedPublication.date
      });
    });

    it('/publications (DELETE) => should delete a publication by id', async () => {
      const publication = await createPublication(prisma);

      const { statusCode: statusCodePublicationExists } = await request(
        app.getHttpServer(),
      ).get(`/publications/${publication.id}`);

      await request(app.getHttpServer()).delete(`/publications/${publication.id}`);

      const { statusCode } = await request(app.getHttpServer()).get(
        `/publications/${publication.id}`,
      );

      expect(statusCodePublicationExists).toBe(HttpStatus.OK);
      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
