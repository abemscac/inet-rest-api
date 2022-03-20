import { Controller, Get } from '@nestjs/common'
import { ArticleCategoryService } from './article-category.service'
import { IArticleCategoryViewModel } from './view-models/i-article-category.view-model'

@Controller('article-categories')
export class ArticleCategoryController {
  constructor(
    private readonly articleCategoryService: ArticleCategoryService,
  ) {}

  @Get()
  async findAll(): Promise<Array<IArticleCategoryViewModel>> {
    return await this.articleCategoryService.findAll()
  }
}
