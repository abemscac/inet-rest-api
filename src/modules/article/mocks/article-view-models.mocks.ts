import { IArticleViewModel } from '../view-models/i-article.view-model'

export const MockArticleViewModels: Array<IArticleViewModel> = [
  {
    id: 1,
    category: {
      id: 2,
      code: 'animal',
      imageUrl: 'https://i.imgur.com/JR2xyV6s.jpg',
    },
    author: {
      id: 1,
      username: 'user0',
      name: '人類一號',
      avatarUrl: 'https://i.imgur.com/MT0npFns.jpg',
      createdAt: new Date('2022-03-27T01:24:31.000Z'),
    },
    coverImageUrl: 'https://i.imgur.com/bqgW6JXh.jpeg',
    title: 'Hello, world',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut a',
    views: 123,
    likes: 45,
    createdAt: new Date('2022-03-28T01:40:29.000Z'),
    lastModifiedAt: null,
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
