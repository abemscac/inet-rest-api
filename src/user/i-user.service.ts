import { IUserViewModel } from 'src/shared-view-models/i-user.view-model'
import { UserUpdatePasswordForm } from './forms/user-update-password.form'
import { UserUpdateForm } from './forms/user-update.form'

export interface IUserService {
  getByUsername(username: string): Promise<IUserViewModel>
  updateById(id: number, form: UserUpdateForm): Promise<void>
  updatePasswordById(id: number, form: UserUpdatePasswordForm): Promise<void>
  removeById(id: number): Promise<void>
}
