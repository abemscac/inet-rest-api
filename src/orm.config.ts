import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { IAppConfig } from './app.config'
import { ArticleCategory } from './modules/article-category/article-category.entity'
import { ArticleComment } from './modules/article-comment/article-comment.entity'
import { ArticleLike } from './modules/article-like/article-like.entity'
import { ArticleSubComment } from './modules/article-sub-comment/article-sub-comment.entity'
import { Article } from './modules/article/article.entity'
import { Collection } from './modules/collection/collection.entity'
import { UserBrowseHistory } from './modules/user-browse-history/user-browse-history.entity'
import { User } from './modules/user/user.entity'
import { isDevelopment } from './utils/env.util'

export const getORMConfig = (appConfig: IAppConfig): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: appConfig.db.host,
  port: appConfig.db.port,
  username: appConfig.db.username,
  password: appConfig.db.password,
  database: appConfig.db.name,
  timezone: 'Z',
  synchronize: isDevelopment(),
  entities: [
    Article,
    ArticleCategory,
    ArticleComment,
    ArticleLike,
    ArticleSubComment,
    Collection,
    User,
    UserBrowseHistory,
  ],
})
