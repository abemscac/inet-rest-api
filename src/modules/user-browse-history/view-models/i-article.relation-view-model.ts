import { IUserViewModel } from 'src/shared-view-models/i-user.view-model'
import { IArticleCategoryRelationViewModel } from './i-article-category.relation-view-model'

export interface IArticleRelationViewModel {
  id: number
  category: IArticleCategoryRelationViewModel
  author: IUserViewModel
  title: string
  coverImageUrl: string
  body: string
}
