import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ArticleCategory } from './article-category.entity'
import { ArticleCategoryDetailProjector } from './projectors/article-category-detail.projector'
import { ArticleCategoryProjector } from './projectors/article-category.projector'
import { IArticleCategoryDetailViewModel } from './view-models/i-article-category-detail.view-model'
import { IArticleCategoryViewModel } from './view-models/i-article-category.view-model'

export interface IArticleCategoryService {
  findAll(): Promise<Array<IArticleCategoryViewModel>>
  findByCode(code: string): Promise<IArticleCategoryDetailViewModel>
}

@Injectable()
export class ArticleCategoryService implements IArticleCategoryService {
  constructor(
    @InjectRepository(ArticleCategory)
    private readonly articleCategoryRepository: Repository<ArticleCategory>,
  ) {}

  async findAll(): Promise<Array<IArticleCategoryViewModel>> {
    return await new ArticleCategoryProjector(
      this.articleCategoryRepository,
      'articleCategory',
    )
      .orderBy('id', 'ASC')
      .projectMany()
  }

  async findByCode(code: string): Promise<IArticleCategoryDetailViewModel> {
    return await new ArticleCategoryDetailProjector(
      this.articleCategoryRepository,
      'articleCategory',
    )
      .where('articleCategory.code = :code', { code })
      .projectOrFail()
  }
}
