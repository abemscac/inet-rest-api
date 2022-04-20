import { MockUser } from '../user/user.mocks'
import { IArticleCommentViewModel } from './view-models/i-article-comment.view-model'

export const MockArticleComments: Array<IArticleCommentViewModel> = [
  {
    id: 1,
    author: MockUser,
    body: 'Hello, world.',
    createdAt: new Date(),
    isRemoved: false,
  },
  {
    id: 2,
    author: null,
    body: null,
    createdAt: new Date(),
    isRemoved: true,
  },
]
