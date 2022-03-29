import { MockUserViewModel } from '../user/user.mocks'
import { IAuthLoginViewModel } from './view-models/i-auth-login.view-model'
import { IAuthViewModel } from './view-models/i-auth.view-model'

export const MockAuthViewModel: IAuthViewModel = {
  accessToken: 'aaaaa.bbbbb.ccccc',
  refreshToken: 'xxxxx.yyyyy.zzzzz',
}

export const MockLoginViewModel: IAuthLoginViewModel = {
  ...MockUserViewModel,
  pendingRemoval: false,
  ...MockAuthViewModel,
}
