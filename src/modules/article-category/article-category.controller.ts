import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiOkExample } from '~/swagger-decorators/api-ok-example'
import {
  MockArticleCategories,
  MockArticleCategoryDetail,
} from './article-category.mocks'
import { ArticleCategoryService } from './article-category.service'
import { IArticleCategoryDetailViewModel } from './view-models/i-article-category-detail.view-model'
import { IArticleCategoryViewModel } from './view-models/i-article-category.view-model'

@ApiTags('Article Categories')
@Controller('article-categories')
export class ArticleCategoryController {
  constructor(
    private readonly articleCategoryService: ArticleCategoryService,
  ) {}

  @ApiOperation({ summary: 'Find all article categories' })
  @ApiOkExample(MockArticleCategories)
  @Get()
  async findAll(): Promise<Array<IArticleCategoryViewModel>> {
    return await this.articleCategoryService.findAll()
  }

  @ApiOperation({ summary: 'Find an article category by code' })
  @ApiOkExample(MockArticleCategoryDetail)
  @Get(':code')
  async findByCode(
    @Param('code') code: string,
  ): Promise<IArticleCategoryDetailViewModel> {
    return await this.articleCategoryService.findByCode(code)
  }
}
