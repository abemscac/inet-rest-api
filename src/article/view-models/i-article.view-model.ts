import { IUserViewModel } from 'src/shared-view-models/i-user.view-model'

export interface IArticleViewModel {
  id: number
  categoryCode: string
  coverImageUrl: string
  title: string
  body: string
  views: number
  likes: number
  createdAt: Date
  lastModifiedAt: Date
  author: IUserViewModel
}
