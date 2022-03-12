import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportPermitModule } from '../passport-permit/passport-permit.module'
import { ArticleLikeController } from './article-like.controller'
import { ArticleLike } from './article-like.entity'
import { ArticleLikeService } from './article-like.service'

@Module({
  imports: [TypeOrmModule.forFeature([ArticleLike]), PassportPermitModule],
  providers: [ArticleLikeService],
  controllers: [ArticleLikeController],
})
export class ArticleLikeModule {}
