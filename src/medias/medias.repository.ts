import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediasRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMediaByTitleAndUsername(createMediaDto: CreateMediaDto) {
    return this.prisma.media.findUnique({
      where: {
        title_username: {
          title: createMediaDto.title,
          username: createMediaDto.username,
        },
      },
    });
  }

  create(createMediaDto: CreateMediaDto) {
    return this.prisma.media.create({ data: createMediaDto });
  }

  findAll() {
    return this.prisma.media.findMany();
  }

  findOne(id: number) {
    return this.prisma.media.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateMediaDto: UpdateMediaDto) {
    return this.prisma.media.update({
      where: {
        id
      },
      data: {
        title: updateMediaDto.title,
        username: updateMediaDto.username
      }
    })
  }

  remove(id: number) {
    return this.prisma.media.delete({
      where: {
        id
      }
    })
  }
}
