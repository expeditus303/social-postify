import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PublicationsRepository } from './publications.repository';
import { MediasService } from 'src/medias/medias.service';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class PublicationsService {
  constructor(
    private readonly publicationsRepository: PublicationsRepository,
    private readonly mediasService: MediasService,
    private readonly postsService: PostsService,
  ) {}

  async create(createPublicationDto: CreatePublicationDto) {
    const { mediaId, postId } = createPublicationDto;

    const existingMediaById = await this.mediasService.findMediaById(mediaId);
    const existingPostById = await this.postsService.findPostById(postId);

    if (!existingMediaById) {
      throw new NotFoundException(`Media with ID ${mediaId} not found.`);
    }

    if (!existingPostById) {
      throw new NotFoundException(`Post with ID ${postId} not found.`);
    }

    return await this.publicationsRepository.create(createPublicationDto);
  }

  async findAll(published: string, after: string) {
    const currentDate = new Date();

    if (published) {
      if (published === 'true') {
        if (after) {
          const afterDate = new Date(after);

          const publishedAfterDate =
            await this.publicationsRepository.findPublishedAfterDate(
              currentDate,
              afterDate,
            );

          return publishedAfterDate;
        }
        const published =
          await this.publicationsRepository.findPublished(currentDate);

        return published;
      } else if (published === 'false') {
        if (after) {
          const afterDate = new Date(after);
          const latestDate = currentDate > afterDate ? currentDate : afterDate;

          const notPublishedAfterDate =
            await this.publicationsRepository.findNotPublishedAfterDate(latestDate);

          return notPublishedAfterDate;
        }

        const notPublishedPublications =
          await this.publicationsRepository.findNotPublished(currentDate);

        return notPublishedPublications;
      }
    }

    return await this.publicationsRepository.findAll();
  }

  async findOne(id: number) {
    return `This action returns a #${id} publication`;
  }

  async update(id: number, updatePublicationDto: UpdatePublicationDto) {
    return `This action updates a #${id} publication`;
  }

  async remove(id: number) {
    return `This action removes a #${id} publication`;
  }
}
