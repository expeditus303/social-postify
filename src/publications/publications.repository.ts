import { Injectable } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PublicationsRepository {
  
  constructor(private readonly prisma: PrismaService) {}

  create(createPublicationDto: CreatePublicationDto) {
    return this.prisma.publication.create({
      data: createPublicationDto,
    });
  }

  findAll() {
    return this.prisma.publication.findMany();
  }

  findPublished(currentDate: Date) {
    return this.prisma.publication.findMany({
      where: {
        date: {
          lt: currentDate,
        },
      },
    });
  }

  findNotPublished(currentDate: Date) {
    return this.prisma.publication.findMany({
      where: {
        date: {
          gt: currentDate,
        },
      },
    });
  }

  findPublishedAfterDate(currentDate: Date, afterDate: Date) {
    return this.prisma.publication.findMany({
      where: {
        date: {
          gte: afterDate,
          lt: currentDate,
        },
      },
    });
  }

  findNotPublishedAfterDate(latestDate: Date) {
    return this.prisma.publication.findMany({
      where: {
        date: {
          gte: latestDate,
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.publication.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updatePublicationDto: UpdatePublicationDto) {
    return this.prisma.publication.update({
      where: {
        id,
      },
      data: updatePublicationDto,
    });
  }

  remove(id: number) {
    return this.prisma.publication.delete({
      where: {
        id,
      },
    });
  }

  findPublicationWithMediaId(mediaId: number) {
    return this.prisma.publication.findFirst({
      where: {
        mediaId
      }
    })
  }

  findPublicationWithPostId(postId: number) {
    return this.prisma.publication.findFirst({
      where: {
        postId
      }
    })
  }
}
