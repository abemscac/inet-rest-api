import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { Length } from 'class-validator'

export class UpdateProfileForm {
  @ApiPropertyOptional({ example: 'User 123' })
  @Length(0, 50)
  @Transform((params) => params.value?.trim())
  name: string | null
}
