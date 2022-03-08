import { IUserViewModel } from 'src/shared-view-models/i-user.view-model'

export interface IUserBrowseHistoryViewModel {
  id: number
  articleId: number
  title: string
  body: string
  coverImageUrl: string
  author: IUserViewModel
}
