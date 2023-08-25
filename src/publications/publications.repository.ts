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
    return `This action returns a #${id} publication`;
  }

  update(id: number, updatePublicationDto: UpdatePublicationDto) {
    return `This action updates a #${id} publication`;
  }

  remove(id: number) {
    return `This action removes a #${id} publication`;
  }
}
