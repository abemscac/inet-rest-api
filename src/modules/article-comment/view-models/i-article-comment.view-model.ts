import { IUserViewModel } from 'src/shared-view-models/i-user.view-model'

export interface IArticleCommentViewModel {
  id: number
  author?: IUserViewModel
  body: string
  createdAt: Date
  isRemoved?: boolean
}
