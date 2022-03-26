import { IUserViewModel } from '~/shared-view-models/i-user.view-model'

export interface IArticleCommentViewModel {
  id: number
  author: IUserViewModel | null
  body: string | null
  createdAt: Date
  isRemoved: boolean
}
