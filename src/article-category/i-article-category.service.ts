import { ArticleCategory } from './article-category.entity'

export interface IArticleCategoryService {
  findAll(): Promise<Array<ArticleCategory>>
}
