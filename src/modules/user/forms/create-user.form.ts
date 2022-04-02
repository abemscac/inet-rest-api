import { Transform } from 'class-transformer'
import { IsNotEmpty, Length, Matches } from 'class-validator'
import { PasswordRegexp, UsernameRegexp } from '~/modules/auth/auth.constants'
import { ApiPropertyImage } from '~/swagger-decorators/api-property-image'
import { ApiPropertyWithRegexp } from '~/swagger-decorators/api-property-with-regexp'

export class CreateUserForm {
  @ApiPropertyWithRegexp(UsernameRegexp)
  @IsNotEmpty()
  @Length(4, 50)
  @Matches(UsernameRegexp)
  username: string

  @ApiPropertyWithRegexp(PasswordRegexp)
  @IsNotEmpty()
  @Length(4, 60)
  @Matches(PasswordRegexp)
  password: string

  @Length(0, 50)
  @Transform((params) => params.value?.trim())
  name?: string | null

  /**
   * This field will be assigned in FastifyFileInterceptor
   */
  @ApiPropertyImage()
  avatar?: Express.Multer.File | null
}
