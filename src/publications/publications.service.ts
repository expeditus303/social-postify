import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PublicationsRepository } from './publications.repository';
import { MediasService } from '../medias/medias.service';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class PublicationsService {
  constructor(
    @Inject(forwardRef(() => MediasService))
    private readonly mediasService: MediasService,
    private readonly publicationsRepository: PublicationsRepository,
    private readonly postsService: PostsService,
  ) {}

  async create(createPublicationDto: CreatePublicationDto) {
    const { mediaId, postId } = createPublicationDto;

    await this.verifyMediaExists(mediaId);

    await this.verifyPostExists(postId);

    return await this.publicationsRepository.create(createPublicationDto);
  }

  async findAll(published: string, after: string) {
    const currentDate = new Date();

    if (published === 'true' && after) {
      const afterDate = new Date(after);
      return this.findPublishedAfterDate(currentDate, afterDate);
    }

    if (published === 'true') {
      return this.findPublished(currentDate);
    }

    if (published === 'false' && after) {
      const afterDate = new Date(after);
      return this.findNotPublishedAfterDate(currentDate, afterDate);
    }

    if (published === 'false') {
      return this.findNotPublished(currentDate);
    }

    return this.publicationsRepository.findAll();
  }

  async findOne(id: number) {
    const publication = await this.verifyPublicationExists(id);

    return publication;
  }

  async update(id: number, updatePublicationDto: UpdatePublicationDto) {
    const publication = await this.verifyPublicationExists(id);

    const publicationDate = new Date(publication.date);
    const currentDate = new Date();

    if (publicationDate < currentDate) {
      throw new ForbiddenException(
        'Updating published publications is not allowed.',
      );
    }

    const { mediaId, postId } = updatePublicationDto;

    await this.verifyMediaExists(mediaId);

    await this.verifyPostExists(postId);

    return await this.publicationsRepository.update(id, updatePublicationDto);
  }

  async remove(id: number) {
    await this.verifyPublicationExists(id);

    return await this.publicationsRepository.remove(id);
  }

  private async verifyMediaExists(mediaId: number) {
    const existingMediaById = await this.mediasService.findMediaById(mediaId);
    if (!existingMediaById) {
      throw new NotFoundException(`Media with ID ${mediaId} not found.`);
    }
    return existingMediaById;
  }

  private async verifyPostExists(postId: number) {
    const existingPostById = await this.postsService.findPostById(postId);
    if (!existingPostById) {
      throw new NotFoundException(`Post with ID ${postId} not found.`);
    }
    return existingPostById;
  }

  private async verifyPublicationExists(publicationId: number) {
    const existingPublicationById =
      await this.publicationsRepository.findOne(publicationId);
    if (!existingPublicationById) {
      throw new NotFoundException(
        `Publication with ID ${publicationId} not found.`,
      );
    }
    return existingPublicationById;
  }

  private async findPublishedAfterDate(currentDate: Date, afterDate: Date) {
    const publishedAfterDate =
      await this.publicationsRepository.findPublishedAfterDate(
        currentDate,
        afterDate,
      );

    return publishedAfterDate;
  }

  private async findPublished(currentDate: Date) {
    const published =
      await this.publicationsRepository.findPublished(currentDate);

    return published;
  }

  private async findNotPublishedAfterDate(currentDate: Date, afterDate: Date) {
    const latestDate = currentDate > afterDate ? currentDate : afterDate;

    const notPublishedAfterDate =
      await this.publicationsRepository.findNotPublishedAfterDate(latestDate);

    return notPublishedAfterDate;
  }

  private async findNotPublished(currentDate: Date) {
    const notPublishedPublications =
      await this.publicationsRepository.findNotPublished(currentDate);

    return notPublishedPublications;
  }

  async findPublicationWithMediaId(mediaId: number) {
    return await this.publicationsRepository.findPublicationWithMediaId(mediaId)
  }

  async findPublicationWithPostId(postId: number) {
    return await this.publicationsRepository.findPublicationWithPostId(postId)
  }
}
