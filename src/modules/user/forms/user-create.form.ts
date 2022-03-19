import { IsNotEmpty, Length } from 'class-validator'

export class UserCreateForm {
  @Length(4, 50)
  @IsNotEmpty()
  username: string

  @Length(4, 60)
  @IsNotEmpty()
  password: string

  @Length(0, 50)
  name?: string

  @Length(0, 2000)
  avatarUrl?: string
}
