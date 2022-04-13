import { MockArticleViewModelsStripped } from '../article/article.mocks'
import { IUserBrowseHistoryViewModel } from './view-models/i-user-browse-history.view-model'

export const MockUserBrowseHistoryViewModels: Array<IUserBrowseHistoryViewModel> =
  MockArticleViewModelsStripped.slice()
    .sort((a, b) => b.id - a.id)
    .map((article, index) => ({
      id: index + 1,
      article,
      createdAt: new Date(),
    }))
