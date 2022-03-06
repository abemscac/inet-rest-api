import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ArticleCategory } from './article-category.entity'
import { IArticleCategoryService } from './i-article-category.service'

@Injectable()
export class ArticleCategoryService implements IArticleCategoryService {
  constructor(
    @InjectRepository(ArticleCategory)
    private readonly articleCategoryRepository: Repository<ArticleCategory>,
  ) {}

  findAll(): Promise<Array<ArticleCategory>> {
    return this.articleCategoryRepository.find({
      where: [{ isRemoved: false }],
      order: {
        index: 'ASC',
      },
    })
  }
}
