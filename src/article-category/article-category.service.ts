import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ArticleCategory } from './article-category.entity'

@Injectable()
export class ArticleCategoryService {
  constructor(
    @InjectRepository(ArticleCategory)
    private articleCategoryRepository: Repository<ArticleCategory>,
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