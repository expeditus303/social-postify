import { Module, forwardRef } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PublicationsModule } from 'src/publications/publications.module';

@Module({
  imports: [PrismaModule, forwardRef(() => PublicationsModule)],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
  exports: [PostsService]
})
export class PostsModule {}
