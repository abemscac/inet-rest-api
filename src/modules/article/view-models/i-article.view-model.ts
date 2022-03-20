import { IArticleSummaryViewModel } from './i-article-summary.view-model'

export interface IArticleViewModel extends IArticleSummaryViewModel {
  lastModifiedAt: Date
}
