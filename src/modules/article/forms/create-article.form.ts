import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsInt, IsNotEmpty, Length, MinLength } from 'class-validator'
import { ApiPropertyImage } from '~/swagger-decorators/api-property-image'

export class CreateArticleForm {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  categoryId: number

  /**
   * This field will be assigned in FastifyFileInterceptor
   */
  @ApiPropertyImage()
  coverImage: Express.Multer.File

  @IsNotEmpty()
  @Length(1, 100)
  @Transform((params) => params.value?.trim())
  title: string

  @IsNotEmpty()
  @MinLength(1)
  @Transform((params) => params.value?.trim())
  body: string
}
