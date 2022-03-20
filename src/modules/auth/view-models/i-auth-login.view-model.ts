import { IUserViewModel } from 'src/shared-view-models/i-user.view-model'
import { IAuthViewModel } from './i-auth.view-model'

export interface IAuthLoginViewModel extends IUserViewModel, IAuthViewModel {
  pendingRemoval: boolean
}
