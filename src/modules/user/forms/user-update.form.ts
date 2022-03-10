import { IsNotEmpty } from 'class-validator'

export class UserUpdateForm {
  @IsNotEmpty()
  name: string

  avatarUrl?: string
}
