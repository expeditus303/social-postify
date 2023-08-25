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
import { PublicationsService } from 'src/publications/publications.service';

@Injectable()
export class MediasService {
  constructor(
    @Inject(forwardRef(() => PublicationsService))
    private readonly publicationsService: PublicationsService,
    private readonly mediasRepository: MediasRepository,
    ) {}

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
    const existingMediaById = await this.mediasRepository.findOne(id);

    if (!existingMediaById) {
      throw new NotFoundException(`Media with ID ${id} not found.`);
    }

    return existingMediaById;
  }

  async update(id: number, updateMediaDto: UpdateMediaDto) {
    const existingMediaById = await this.mediasRepository.findOne(id);

    if (!existingMediaById) {
      throw new NotFoundException(`Media with ID ${id} not found.`);
    }

    const existingMedia =
      await this.mediasRepository.findMediaByTitleAndUsername(updateMediaDto);

    if (existingMedia) {
      throw new ConflictException(
        'A media entry with this title and username already exists.',
      );
    }

    return await this.mediasRepository.update(id, updateMediaDto)
  }

  // TODO só pode ser deletada se não estiver fazendo parte de nenhuma publicação (agendada ou publicada). Neste caso, retornar o status code 403 Forbidden.
  async remove(id: number) {
    const existingMediaById = await this.mediasRepository.findOne(id);

    if (!existingMediaById) {
      throw new NotFoundException(`Media with ID ${id} not found.`);
    }

    const mediaHasPublication = await this.publicationsService.findPublicationWithMediaId(id)

    if (mediaHasPublication) {
      throw new ForbiddenException(`The media with ID ${id} is associated with a publication and cannot be deleted.`);
    }

    return await this.mediasRepository.remove(id)
  }

  async findMediaById(id: number) {
    return await this.mediasRepository.findOne(id);
  }
}
