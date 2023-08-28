import { PrismaService } from '../../src/prisma/prisma.service';
import { generateRandomString } from '../test-utils/generateRandomString.utils';

export async function createPost(prisma: PrismaService) {

  const postData = {
    title: generateRandomString(8),
    text: generateRandomString(15),
    image:
      `https://www.rollingstone.com/wp-content/uploads/2020/07/${generateRandomString(10)}.jpg`,
  };

  return await prisma.post.create({
    data: postData,
  });
}
