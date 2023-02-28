import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { getAppConfig } from './app.config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ArticleCategoryModule } from './modules/article-category/article-category.module'
import { ArticleCommentModule } from './modules/article-comment/article-comment.module'
import { ArticleLikeModule } from './modules/article-like/article-like.module'
import { ArticleSubCommentModule } from './modules/article-sub-comment/article-sub-comment.module'
import { ArticleModule } from './modules/article/article.module'
import { AuthModule } from './modules/auth/auth.module'
import { CollectionModule } from './modules/collection/collection.module'
import { DevTestDbModule } from './modules/dev-test-db/dev-test-db.module'
import { UserBrowseHistoryModule } from './modules/user-browse-history/user-browse-history.module'
import { UserModule } from './modules/user/user.module'
import { getORMConfig } from './orm.config'
import { isDevelopment, isTest } from './utils/env.util'

const devTestModules = [DevTestDbModule]

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      load: [getAppConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => getORMConfig(getAppConfig()),
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    ArticleModule,
    ArticleCategoryModule,
    ArticleCommentModule,
    ArticleSubCommentModule,
    ArticleLikeModule,
    AuthModule,
    CollectionModule,
    UserModule,
    UserBrowseHistoryModule,
    ...(isDevelopment() || isTest() ? devTestModules : []),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
