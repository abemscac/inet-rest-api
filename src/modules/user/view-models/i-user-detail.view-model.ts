import { IUserViewModel } from '~/shared-view-models/i-user.view-model'

export interface IUserDetailViewModel extends IUserViewModel {
  createdArticleCount: number
}
