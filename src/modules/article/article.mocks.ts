import { MockUser } from '../user/user.mocks'
import { ARTICLE_BODY_PREVIEW_LENGTH } from './projectors/article.projector'
import { IArticleDetailViewModel } from './view-models/i-article-detail.view-model'
import { IArticleViewModel } from './view-models/i-article.view-model'

export const MockArticles: Array<IArticleViewModel> = [
  {
    id: 1,
    category: {
      code: 'animal',
      imageUrl: 'https://i.imgur.com/JR2xyV6s.jpg',
    },
    author: MockUser,
    coverImageUrl: 'https://i.imgur.com/bqgW6JXh.jpeg',
    title: 'Hello world',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    views: 123,
    likes: 45,
    createdAt: new Date(),
    lastModifiedAt: null,
  },
  {
    id: 2,
    category: {
      code: 'sports',
      imageUrl: 'https://i.imgur.com/s4PDhtLs.jpg',
    },
    author: MockUser,
    coverImageUrl: 'https://i.imgur.com/bqgW6JXh.jpeg',
    title: 'Hello world 2',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    views: 12,
    likes: 3,
    createdAt: new Date(),
    lastModifiedAt: new Date(),
  },
]

export const MockArticlesStripped: Array<IArticleViewModel> = MockArticles.map(
  (article) => ({
    ...article,
    body: article.body.substring(0, ARTICLE_BODY_PREVIEW_LENGTH),
  }),
)

export const MockArticleDetail: IArticleDetailViewModel = {
  ...MockArticles[0],
  likeId: null,
  collectionId: null,
}
