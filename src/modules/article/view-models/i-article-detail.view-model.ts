import { IArticleViewModel } from './i-article.view-model'

export interface IArticleDetailViewModel extends IArticleViewModel {
  likeId: number | null
  collectionId: number | null
}
