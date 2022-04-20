import { MockArticlesStripped } from '../article/article.mocks'
import { ICollectionViewModel } from './view-models/i-collection.view-model'

export const MockCollections: Array<ICollectionViewModel> =
  MockArticlesStripped.slice()
    .sort((a, b) => b.id - a.id)
    .map((article, index) => ({
      id: index + 1,
      article,
      createdAt: new Date(),
    }))
