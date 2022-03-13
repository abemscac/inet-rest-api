import { IBaseService } from 'src/base-services/i-base.service'
import { UserUpdatePasswordForm } from './forms/user-update-password.form'
import { UserUpdateForm } from './forms/user-update.form'
import { UserFindByUsernameOptions } from './options/user.find-by-username.options'
import { User } from './user.entity'

export interface IUserService extends IBaseService {
  findByUsername(
    username: string,
    options?: UserFindByUsernameOptions,
  ): Promise<User>
  updateById(id: number, form: UserUpdateForm): Promise<void>
  // updatePasswordById(id: number, form: UserUpdatePasswordForm): Promise<void>
  // removeById(id: number): Promise<void>
}
