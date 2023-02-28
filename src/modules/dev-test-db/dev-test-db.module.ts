import { Module, OnModuleInit } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { isDevelopment, isTest } from '../../utils/env.util'
import { ArticleCategory } from '../article-category/article-category.entity'
import { ArticleComment } from '../article-comment/article-comment.entity'
import { ArticleLike } from '../article-like/article-like.entity'
import { ArticleSubComment } from '../article-sub-comment/article-sub-comment.entity'
import { Article } from '../article/article.entity'
import { Collection } from '../collection/collection.entity'
import { UserBrowseHistory } from '../user-browse-history/user-browse-history.entity'
import { User } from '../user/user.entity'
import { DevTestDbController } from './dev-test-db.controller'
import { ResetDbService } from './reset-db.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Article,
      ArticleCategory,
      ArticleComment,
      ArticleLike,
      ArticleSubComment,
      Collection,
      User,
      UserBrowseHistory,
    ]),
  ],
  providers: [ResetDbService],
  exports: [],
  controllers: [DevTestDbController],
})
export class DevTestDbModule implements OnModuleInit {
  constructor(private readonly resetDbService: ResetDbService) {}

  async onModuleInit(): Promise<void> {
    if (!isDevelopment() && !isTest()) {
      throw new Error(
        `${DevTestDbModule.name} must not be used in non-development and non-test environments.`,
      )
    }
    await this.resetDbService.resetDb()
  }
}
