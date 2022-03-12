import { IsNotEmpty, IsOptional } from 'class-validator'

export class UserUpdateForm {
  @IsNotEmpty()
  name: string

  @IsOptional()
  avatarUrl?: string
}
