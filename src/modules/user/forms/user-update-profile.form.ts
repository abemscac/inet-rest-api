import { IsNotEmpty, IsOptional } from 'class-validator'

export class UserUpdateProfileForm {
  @IsNotEmpty()
  name: string

  @IsOptional()
  avatarUrl?: string
}
