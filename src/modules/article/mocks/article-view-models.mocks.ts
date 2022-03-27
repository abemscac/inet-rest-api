import { IArticleViewModel } from '../view-models/i-article.view-model'

export const ArticleViewModelsMocks: Array<IArticleViewModel> = [
  {
    id: 1,
    category: {
      id: 1,
      code: 'chat',
      imageUrl: 'https://i.imgur.com/cnGUSeYs.jpg',
    },
    author: {
      id: 1,
      username: 'user0',
      name: '人類一號',
      avatarUrl: 'https://i.imgur.com/MT0npFns.jpg',
      createdAt: new Date('2022-03-25T06:47:57.000Z'),
    },
    coverImageUrl: 'https://i.imgur.com/1R7rO90h.jpeg',
    title: 'test',
    body: 'oo',
    views: 27,
    likes: 0,
    createdAt: new Date('2022-03-25T06:50:37.000Z'),
    lastModifiedAt: null,
  },
]
