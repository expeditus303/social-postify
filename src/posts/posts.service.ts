import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async create(createPostDto: CreatePostDto) {
    return await this.postsRepository.create(createPostDto);
  }

  async findAll() {
    return await this.postsRepository.findAll();
  }

  async findOne(id: number) {
    const existingPostById = await this.postsRepository.findOne(id);

    if (!existingPostById) {
      throw new NotFoundException(`Post with ID ${id} not found.`);
    }

    return existingPostById;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const existingPostById = await this.postsRepository.findOne(id);

    if (!existingPostById) {
      throw new NotFoundException(`Post with ID ${id} not found.`);
    }

    return await this.postsRepository.update(id, updatePostDto);
  }

  // TODO só pode ser deletada se não estiver fazendo parte de nenhuma publicação (agendada ou publicada). Neste caso, retornar o status code 403 Forbidden.
  async remove(id: number) {
    const existingMediaById = await this.postsRepository.findOne(id);

    if (!existingMediaById) {
      throw new NotFoundException(`Post with ID ${id} not found.`);
    }

    return await this.postsRepository.remove(id);
  }
}
