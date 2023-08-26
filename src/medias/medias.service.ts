import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediasRepository } from './medias.repository';
import { PublicationsService } from '../publications/publications.service';

@Injectable()
export class MediasService {
  constructor(
    @Inject(forwardRef(() => PublicationsService))
    private readonly publicationsService: PublicationsService,
    private readonly mediasRepository: MediasRepository,
  ) {}

  async create(createMediaDto: CreateMediaDto) {
    await this.throwIfMediaWithTitleAndUsernameExists(createMediaDto);

    return await this.mediasRepository.create(createMediaDto);
  }

  async findAll() {
    return await this.mediasRepository.findAll();
  }

  async findOne(id: number) {
    const existingMediaById = await this.findMediaOrThrow(id);

    return existingMediaById;
  }

  async update(id: number, updateMediaDto: UpdateMediaDto) {
    await this.findMediaOrThrow(id);

    await this.throwIfMediaWithTitleAndUsernameExists(updateMediaDto);

    return await this.mediasRepository.update(id, updateMediaDto);
  }

  async remove(id: number) {
    await this.findMediaOrThrow(id);

    const mediaHasPublication =
      await this.publicationsService.findPublicationWithMediaId(id);

    if (mediaHasPublication) {
      throw new ForbiddenException(
        `The media with ID ${id} is associated with a publication and cannot be deleted.`,
      );
    }

    return await this.mediasRepository.remove(id);
  }

  async findMediaById(id: number) {
    return await this.mediasRepository.findOne(id);
  }

  private async findMediaOrThrow(id: number) {
    const media = await this.mediasRepository.findOne(id);
    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found.`);
    }
    return media;
  }

  private async throwIfMediaWithTitleAndUsernameExists(
    dto: CreateMediaDto | UpdateMediaDto,
  ) {
    const existingMedia =
      await this.mediasRepository.findMediaByTitleAndUsername(dto);
    if (existingMedia) {
      throw new ConflictException(
        'A media entry with this title and username already exists.',
      );
    }
  }
}
