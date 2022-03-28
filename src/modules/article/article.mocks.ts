import { MockUserViewModel } from '../user/user.mocks'
import { IArticleViewModel } from './view-models/i-article.view-model'

export const MockArticleViewModels: Array<IArticleViewModel> = [
  {
    id: 1,
    category: {
      id: 2,
      code: 'animal',
      imageUrl: 'https://i.imgur.com/JR2xyV6s.jpg',
    },
    author: MockUserViewModel,
    coverImageUrl: 'https://i.imgur.com/bqgW6JXh.jpeg',
    title: 'Hello world',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut a',
    views: 123,
    likes: 45,
    createdAt: new Date(),
    lastModifiedAt: null,
  },
  {
    id: 2,
    category: {
      id: 5,
      code: 'sports',
      imageUrl: 'https://i.imgur.com/s4PDhtLs.jpg',
    },
    author: MockUserViewModel,
    coverImageUrl: 'https://i.imgur.com/bqgW6JXh.jpeg',
    title: 'Hello world 2',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut a',
    views: 12,
    likes: 3,
    createdAt: new Date(),
    lastModifiedAt: new Date(),
  },
]

export const MockArticleViewModelsStripped: Array<IArticleViewModel> = (() => {
  const article = MockArticleViewModels[0]
  const strippedArticle: IArticleViewModel = {
    ...article,
    body: article.body.substring(0, 200),
  }
  return [strippedArticle]
})()
