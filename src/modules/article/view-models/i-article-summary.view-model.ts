import { IArticleCategoryViewModel } from 'src/modules/article-category/view-models/i-article-category.view-model'
import { IUserViewModel } from 'src/shared-view-models/i-user.view-model'

export interface IArticleSummaryViewModel {
  id: number
  category: IArticleCategoryViewModel
  author: IUserViewModel
  coverImageUrl: string
  title: string
  body: string
  views: number
  likes: number
  createdAt: Date
}
