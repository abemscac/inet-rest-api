import { IArticleViewModel } from './i-article.view-model'

export interface IArticleDetailViewModel extends IArticleViewModel {
  collectionId: number | null
}
