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
    const {mediaId, postId}  = createPublicationDto

    const existingMediaById = await this.mediasService.findMediaById(mediaId)
    const existingPostById = await this.postsService.findPostById(postId)

    if (!existingMediaById) {
      throw new NotFoundException(`Media with ID ${mediaId} not found.`);
    }

    if (!existingPostById) {
      throw new NotFoundException(`Post with ID ${postId} not found.`);
    }
    
    return await this.publicationsRepository.create(createPublicationDto)
  }

  findAll() {
    return `This action returns all publications`;
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
