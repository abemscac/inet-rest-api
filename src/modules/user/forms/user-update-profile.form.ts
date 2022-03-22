import { IsNotEmpty } from 'class-validator'

export class UserUpdateProfileForm {
  @IsNotEmpty()
  name: string
}
