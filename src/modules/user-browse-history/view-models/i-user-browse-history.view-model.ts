import { IArticleSummaryViewModel } from 'src/modules/article/view-models/i-article-summary.view-model'

export interface IUserBrowseHistoryViewModel {
  id: number
  article: IArticleSummaryViewModel
  createdAt: Date
}
