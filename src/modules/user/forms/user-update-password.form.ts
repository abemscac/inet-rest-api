import { Transform } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class UserUpdatePasswordForm {
  @IsNotEmpty()
  @Transform((params) => params.value?.trim())
  oldPassword: string

  @IsNotEmpty()
  @Transform((params) => params.value?.trim())
  newPassword: string
}
