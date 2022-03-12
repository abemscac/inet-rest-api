import { IBaseService } from 'src/base-service/i-base.service'
import { AuthLoginForm } from './forms/auth.login.form'
import { IAuthLoginViewModel } from './view-models/i-auth-login.view-model'
import { IAuthViewModel } from './view-models/i-auth.view-model'

export interface IAuthService extends IBaseService {
  login(form: AuthLoginForm): Promise<IAuthLoginViewModel>
  refresh(): Promise<IAuthViewModel>
  logout(): Promise<void>
}
