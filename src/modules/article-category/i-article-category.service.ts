import { IBaseService } from 'src/base-services/i-base.service'
import { ArticleCategory } from './article-category.entity'

export interface IArticleCategoryService extends IBaseService {
  findAll(): Promise<Array<ArticleCategory>>
}
