import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ArticleCategory } from './article-category.entity'

export interface IArticleCategoryService {
  findAll(): Promise<Array<ArticleCategory>>
}

@Injectable()
export class ArticleCategoryService implements IArticleCategoryService {
  constructor(
    @InjectRepository(ArticleCategory)
    private readonly articleCategoryRepository: Repository<ArticleCategory>,
  ) {}

  async findAll(): Promise<Array<ArticleCategory>> {
    return await this.articleCategoryRepository.find({
      order: {
        code: 'ASC',
      },
    })
  }
}
