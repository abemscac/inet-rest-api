import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, Length, Matches } from 'class-validator'
import { UsernameRegexp } from '~/modules/auth/auth.constants'
import { ApiPropertyWithRegexp } from '~/swagger-decorators/api-property-with-regexp'

export class UpdateProfileForm {
  @ApiPropertyWithRegexp(UsernameRegexp, {
    example: 'username123',
  })
  @IsNotEmpty()
  @Matches(UsernameRegexp)
  @Length(4, 50)
  username: string

  @ApiPropertyOptional({ example: 'User 123' })
  @Length(0, 50)
  @Transform((params) => params.value?.trim())
  name: string | null
}
