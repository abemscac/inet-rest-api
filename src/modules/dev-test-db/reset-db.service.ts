import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { getConnection, Repository } from 'typeorm'
import { isDevelopment, isTest } from '~/utils/env.util'
import { articleCategoryFixtures } from '../../dev-fixtures/article-category.fixtures'
import { articleFixtures } from '../../dev-fixtures/article.fixtures'
import { userFixtures } from '../../dev-fixtures/user.fixtures'
import { ArticleCategory } from '../article-category/article-category.entity'
import { ArticleComment } from '../article-comment/article-comment.entity'
import { ArticleLike } from '../article-like/article-like.entity'
import { ArticleSubComment } from '../article-sub-comment/article-sub-comment.entity'
import { Article } from '../article/article.entity'
import { Collection } from '../collection/collection.entity'
import { UserBrowseHistory } from '../user-browse-history/user-browse-history.entity'
import { User } from '../user/user.entity'

@Injectable()
export class ResetDbService {
  constructor(
    @InjectRepository(Article)
    private readonly artileRepository: Repository<Article>,
    @InjectRepository(ArticleCategory)
    private readonly articleCategoryRepository: Repository<ArticleCategory>,
    @InjectRepository(ArticleComment)
    private readonly articleCommentRepository: Repository<ArticleComment>,
    @InjectRepository(ArticleLike)
    private readonly articleLikeRepository: Repository<ArticleLike>,
    @InjectRepository(ArticleSubComment)
    private readonly articleSubCommentRepository: Repository<ArticleSubComment>,
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserBrowseHistory)
    private readonly userBrowseHistoryRepository: Repository<UserBrowseHistory>,
  ) {}

  async resetDb(): Promise<void> {
    if (isDevelopment() || isTest()) {
      await this.synchronizeDatabase()
      await this.insertFixtures()
    }
  }

  private async synchronizeDatabase(): Promise<void> {
    Logger.log('Synchronize database', ResetDbService.name)
    const connection = getConnection()
    await connection.synchronize(true)
  }

  private async insertFixtures(): Promise<void> {
    Logger.log('Insert fixtures', ResetDbService.name)
    await this.userRepository.insert(userFixtures)
    await this.articleCategoryRepository.insert(articleCategoryFixtures)
    await this.artileRepository.insert(articleFixtures)
  }
}
