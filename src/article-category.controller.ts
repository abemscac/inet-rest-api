import { Controller, Get } from '@nestjs/common'
import { ArticleCategoryService } from './article-category.service'

@Controller('article-categories')
export class ArticleCategoryController {
  constructor(
    private readonly articleCategoryService: ArticleCategoryService,
  ) {}

  @Get()
  findAll(): string {
    return this.articleCategoryService.getHello()
  }
}
