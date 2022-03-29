import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, Length, Matches } from 'class-validator'
import { PasswordRegexp, UsernameRegexp } from '~/modules/auth/auth.constants'
import { ApiPropertyImage } from '~/swagger-decorators/api-property-image'

export class UserCreateForm {
  @ApiProperty({
    description: `RegExp: ${UsernameRegexp.source}`,
  })
  @IsNotEmpty()
  @Length(4, 50)
  @Matches(UsernameRegexp)
  username: string

  @IsNotEmpty()
  @ApiProperty({
    description: `RegExp: ${PasswordRegexp.source}`,
  })
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
