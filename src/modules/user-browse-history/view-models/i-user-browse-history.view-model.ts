import { IArticleRelationViewModel } from './i-article.relation-view-model'

export interface IUserBrowseHistoryViewModel {
  id: number
  article: IArticleRelationViewModel
  createdAt: Date
}
