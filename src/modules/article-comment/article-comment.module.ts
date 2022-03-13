import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Article } from '../article/article.entity'
import { PassportPermitModule } from '../passport-permit/passport-permit.module'
import { ArticleCommentController } from './article-comment.controller'
import { ArticleComment } from './article-comment.entity'
import { ArticleCommentService } from './article-comment.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, ArticleComment]),
    PassportPermitModule,
  ],
  providers: [ArticleCommentService],
  controllers: [ArticleCommentController],
})
export class ArticleCommentModule {}
