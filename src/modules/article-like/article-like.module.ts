import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ArticleLikeController } from './article-like.controller'
import { ArticleLike } from './article-like.entity'
import { ArticleLikeService } from './article-like.service'

@Module({
  imports: [TypeOrmModule.forFeature([ArticleLike])],
  providers: [ArticleLikeService],
  controllers: [ArticleLikeController],
})
export class ArticleLikeModule {}
