import { IUserViewModel } from 'src/shared-view-models/i-user.view-model'

export interface IAuthLoginViewModel extends IUserViewModel {
  accessToken: string
}
