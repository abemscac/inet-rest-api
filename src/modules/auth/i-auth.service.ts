import { AuthLoginForm } from './forms/auth.login.form'
import { IAuthLoginViewModel } from './view-models/i-auth-login.view-model'

export interface IAuthService {
  login(form: AuthLoginForm): Promise<IAuthLoginViewModel>
}
