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
    return existingPostById
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    return await `This action updates a #${id} post`;
  }

  async remove(id: number) {
    return await `This action removes a #${id} post`;
  }
}
