import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';
import { PublicationsService } from '../publications/publications.service';

@Injectable()
export class PostsService {
  constructor(
    @Inject(forwardRef(() => PublicationsService))
    private readonly publicationsService: PublicationsService,
    private readonly postsRepository: PostsRepository,
  ) {}

  async create(createPostDto: CreatePostDto) {
    return await this.postsRepository.create(createPostDto);
  } a

  async findAll() {
    return await this.postsRepository.findAll();
  }

  async findOne(id: number) {
    const existingPostById = await this.findPostOrThrow(id);

    return existingPostById;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.findPostOrThrow(id);

    return await this.postsRepository.update(id, updatePostDto);
  }

  async remove(id: number) {
    await this.findPostOrThrow(id);

    const postHasPublication =
      await this.publicationsService.findPublicationWithPostId(id);

    if (postHasPublication) {
      throw new ForbiddenException(
        `The post with ID ${id} is associated with a publication and cannot be deleted.`,
      );
    }

    return await this.postsRepository.remove(id);
  }

  async findPostById(id: number) {
    return await this.postsRepository.findOne(id);
  }

  private async findPostOrThrow(id: number) {
    const post = await this.postsRepository.findOne(id);
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found.`);
    }
    return post;
  }
}
