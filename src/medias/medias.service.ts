import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediasRepository } from './medias.repository';

@Injectable()
export class MediasService {
  constructor(private readonly mediasRepository: MediasRepository) {}

  async create(createMediaDto: CreateMediaDto) {
    const existingMedia =
      await this.mediasRepository.findMediaByTitleAndUsername(createMediaDto);

    if (existingMedia) {
      throw new ConflictException(
        'A media entry with this title and username already exists.',
      );
    }

    return await this.mediasRepository.create(createMediaDto);
  }

  async findAll() {
    return await this.mediasRepository.findAll();
  }

  async findOne(id: number) {
    const existingMedia = await this.mediasRepository.findOne(id);

    if (!existingMedia) {
      throw new NotFoundException(`Media with ID ${id} not found.`);
    }

    return existingMedia;
  }

  update(id: number, updateMediaDto: UpdateMediaDto) {
    return `This action updates a #${id} media`;
  }

  remove(id: number) {
    return `This action removes a #${id} media`;
  }
}
