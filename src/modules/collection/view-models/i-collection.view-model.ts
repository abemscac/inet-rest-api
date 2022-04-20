import { IArticleViewModel } from '~/modules/article/view-models/i-article.view-model'

export interface ICollectionViewModel {
  id: number
  article: IArticleViewModel
  createdAt: Date
}
