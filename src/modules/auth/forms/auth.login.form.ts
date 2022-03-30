import { IsNotEmpty, Length, Matches } from 'class-validator'
import { ApiPropertyWithRegexp } from '~/swagger-decorators/api-property-with-regexp'
import { PasswordRegexp, UsernameRegexp } from '../auth.constants'

export class AuthLoginForm {
  @ApiPropertyWithRegexp(UsernameRegexp, {
    example: 'username123',
  })
  @IsNotEmpty()
  @Matches(UsernameRegexp)
  @Length(4, 50)
  username: string

  @ApiPropertyWithRegexp(PasswordRegexp, {
    example: 'password123',
  })
  @IsNotEmpty()
  @Matches(PasswordRegexp)
  @Length(4, 60)
  password: string
}
