import { Injectable } from '@nestjs/common'
import { ArticleCategory } from './interfaces/article-category.interface'

@Injectable()
export class ArticleCategoryService {
  findAll(): Promise<Array<ArticleCategory>> {}
}
