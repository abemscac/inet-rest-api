import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length, Matches } from 'class-validator'
import { PasswordRegexp, UsernameRegexp } from '../auth.constants'

export class AuthLoginForm {
  @ApiProperty({ example: 'username123' })
  @IsNotEmpty()
  @Matches(UsernameRegexp)
  @Length(4, 50)
  username: string

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @Matches(PasswordRegexp)
  @Length(4, 60)
  password: string
}
