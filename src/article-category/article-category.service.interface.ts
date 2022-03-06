import { ArticleCategory } from './article-category.entity'

export interface ArticleCategoryServiceInterface {
  findAll(): Promise<Array<ArticleCategory>>
}
