import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ArticleCategory } from './article-category.entity'
import { ArticleCategoryProjector } from './projectors/article-category.projector'
import { IArticleCategoryViewModel } from './view-models/i-article-category.view-model'

export interface IArticleCategoryService {
  findAll(): Promise<Array<IArticleCategoryViewModel>>
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
}
