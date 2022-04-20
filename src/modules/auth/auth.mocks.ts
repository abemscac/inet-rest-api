import { MockUser } from '../user/user.mocks'
import { IAuthLoginViewModel } from './view-models/i-auth-login.view-model'
import { IAuthViewModel } from './view-models/i-auth.view-model'

export const MockAuth: IAuthViewModel = {
  accessToken: 'aaaaa.bbbbb.ccccc',
  refreshToken: 'xxxxx.yyyyy.zzzzz',
}

export const MockLogin: IAuthLoginViewModel = {
  ...MockUser,
  pendingRemoval: false,
  ...MockAuth,
}
