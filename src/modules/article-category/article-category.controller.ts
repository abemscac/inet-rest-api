import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ArticleCategoryService } from './article-category.service'
import { IArticleCategoryViewModel } from './view-models/i-article-category.view-model'

@ApiTags('Article Categories')
@Controller('article-categories')
export class ArticleCategoryController {
  constructor(
    private readonly articleCategoryService: ArticleCategoryService,
  ) {}

  @ApiOperation({ summary: 'Find all article categories' })
  @Get()
  async findAll(): Promise<Array<IArticleCategoryViewModel>> {
    return await this.articleCategoryService.findAll()
  }
}
