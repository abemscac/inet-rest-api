import { IsNotEmpty } from 'class-validator'

export class UserUpdatePasswordForm {
  @IsNotEmpty()
  oldPassword: string

  @IsNotEmpty()
  newPassword: string
}
