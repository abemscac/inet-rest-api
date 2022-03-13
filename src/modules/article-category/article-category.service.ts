import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseService, IBaseService } from 'src/base-services/base.service'
import { Repository } from 'typeorm'
import { ArticleCategory } from './article-category.entity'

export interface IArticleCategoryService extends IBaseService {
  findAll(): Promise<Array<ArticleCategory>>
}

@Injectable()
export class ArticleCategoryService
  extends BaseService
  implements IArticleCategoryService
{
  constructor(
    @InjectRepository(ArticleCategory)
    private readonly articleCategoryRepository: Repository<ArticleCategory>,
  ) {
    super()
  }

  findAll(): Promise<Array<ArticleCategory>> {
    return this.articleCategoryRepository.find({
      where: {
        isRemoved: false,
      },
      order: {
        index: 'ASC',
      },
    })
  }
}
