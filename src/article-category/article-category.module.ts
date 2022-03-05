import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ArticleCategoryController } from './article-category.controller'
import { ArticleCategory } from './article-category.entity'
import { ArticleCategoryService } from './article-category.service'

@Module({
  imports: [TypeOrmModule.forFeature([ArticleCategory])],
  providers: [ArticleCategoryService],
  controllers: [ArticleCategoryController],
})
export class ArticleCategoryModule {}
