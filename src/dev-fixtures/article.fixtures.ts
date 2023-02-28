import { Article } from '~/modules/article/article.entity'

export const articleFixtures: Article[] = [
  {
    id: 1,
    categoryId: 1,
    coverImageHash: 'cZ0aHmyh',
    coverImageExt: 'jpeg',
    title: '靜夜思',
    body: '床前明月光，疑是地上霜。\n舉頭望明月，低頭思故鄉。',
    views: 0,
    authorId: 1,
    createdAt: new Date(),
    isRemoved: false,
    category: null as any,
    author: null as any,
    likes: [],
    comments: [],
    browseHistories: [],
    collections: [],
  },
]
