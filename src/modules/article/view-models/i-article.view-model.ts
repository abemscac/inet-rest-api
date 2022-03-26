import { IArticleCategoryViewModel } from '~/modules/article-category/view-models/i-article-category.view-model'
import { IUserViewModel } from '~/shared-view-models/i-user.view-model'

export interface IArticleViewModel {
  id: number
  category: IArticleCategoryViewModel
  author: IUserViewModel | null
  coverImageUrl: string
  title: string
  body: string
  views: number
  likes: number
  createdAt: Date
  lastModifiedAt: Date | null
}
