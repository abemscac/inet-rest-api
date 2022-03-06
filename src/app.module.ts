import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ArticleCategoryModule } from './article-category/article-category.module'
import { ArticleLikeModule } from './article-like/article-like.module'

@Module({
  imports: [TypeOrmModule.forRoot(), ArticleCategoryModule, ArticleLikeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
