import { MockUserViewModel } from '../user/user.mocks'
import { IArticleCommentViewModel } from './view-models/i-article-comment.view-model'

export const MockArticleCommentViewModels: Array<IArticleCommentViewModel> = [
  {
    id: 1,
    author: MockUserViewModel,
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
