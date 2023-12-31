import { Module, forwardRef } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PublicationsRepository } from './publications.repository';
import { PostsModule } from '../posts/posts.module';
import { MediasModule } from '../medias/medias.module';

@Module({
  imports: [PrismaModule, forwardRef(() => PostsModule), forwardRef(() => MediasModule)],
  controllers: [PublicationsController],
  providers: [PublicationsService, PublicationsRepository],
  exports: [PublicationsService],
})
export class PublicationsModule {}
