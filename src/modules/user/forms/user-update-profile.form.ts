import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { Length } from 'class-validator'
import { ApiPropertyImage } from '~/swagger-decorators/api-property-image'

export class UserUpdateProfileForm {
  @ApiPropertyOptional({ example: 'User 123' })
  @Length(0, 50)
  @Transform((params) => params.value?.trim())
  name: string | null

  /**
   * This field will be assigned in FastifyFileInterceptor
   */
  @ApiPropertyImage()
  avatar?: Express.Multer.File
}
