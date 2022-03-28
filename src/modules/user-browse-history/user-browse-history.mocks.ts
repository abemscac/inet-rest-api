import { MockArticleViewModels } from '../article/article.mocks'
import { IUserBrowseHistoryViewModel } from './view-models/i-user-browse-history.view-model'

export const MockUserBrowseHistoryViewModels: Array<IUserBrowseHistoryViewModel> =
  MockArticleViewModels.slice()
    .sort((a, b) => b.id - a.id)
    .map((article, index) => ({
      id: index + 1,
      article,
      createdAt: new Date(),
    }))
