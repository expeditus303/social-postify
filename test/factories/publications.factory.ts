import { PrismaService } from '../../src/prisma/prisma.service';
import { generateRandomString } from '../test-utils/generateRandomString.utils';
import { createMedia } from './medias.factory';
import { createPost } from './posts.factory';


export async function createPublication(prisma: PrismaService) {
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

  return await prisma.publication.create({
    data: publication,
  });
}

