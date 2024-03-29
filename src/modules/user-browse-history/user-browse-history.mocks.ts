import { MockArticlesStripped } from '../article/article.mocks'
import { IUserBrowseHistoryViewModel } from './view-models/i-user-browse-history.view-model'

export const MockUserBrowseHistories: Array<IUserBrowseHistoryViewModel> =
  MockArticlesStripped.slice()
    .sort((a, b) => b.id - a.id)
    .map((article, index) => ({
      id: index + 1,
      article,
      createdAt: new Date(),
    }))
