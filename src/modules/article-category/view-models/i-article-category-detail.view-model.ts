import { IArticleCategoryViewModel } from './i-article-category.view-model'

export interface IArticleCategoryDetailViewModel
  extends IArticleCategoryViewModel {
  newArticleCountToday: number
}
