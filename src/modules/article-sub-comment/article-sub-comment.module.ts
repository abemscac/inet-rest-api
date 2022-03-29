import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ArticleComment } from '../article-comment/article-comment.entity'
import { PassportPermitModule } from '../passport-permit/passport-permit.module'
import { ArticleSubCommentController } from './article-sub-comment.controller'
import { ArticleSubComment } from './article-sub-comment.entity'
import { ArticleSubCommentService } from './article-sub-comment.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleComment, ArticleSubComment]),
    PassportPermitModule,
  ],
  providers: [ArticleSubCommentService],
  controllers: [ArticleSubCommentController],
})
export class ArticleSubCommentModule {}
