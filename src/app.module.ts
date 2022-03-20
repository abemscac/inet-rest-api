import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ArticleCategoryModule } from './modules/article-category/article-category.module'
import { ArticleCommentModule } from './modules/article-comment/article-comment.module'
import { ArticleLikeModule } from './modules/article-like/article-like.module'
import { ArticleModule } from './modules/article/article.module'
import { AuthModule } from './modules/auth/auth.module'
import { UserBrowseHistoryModule } from './modules/user-browse-history/user-browse-history.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot(),
    ArticleModule,
    ArticleCategoryModule,
    ArticleCommentModule,
    ArticleLikeModule,
    AuthModule,
    UserModule,
    UserBrowseHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
