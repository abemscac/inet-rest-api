import { Transform, Type } from 'class-transformer'
import { IsInt, IsNotEmpty, Length, MinLength } from 'class-validator'
import { ApiPropertyImage } from '~/swagger-decorators/api-property-image'

export class ArticleUpdateForm {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  categoryId: number

  /**
   * This field will be assigned in FastifyFileInterceptor
   */
  @ApiPropertyImage('When provided, the original cover image will be replaced.')
  coverImage?: Express.Multer.File

  @IsNotEmpty()
  @Length(1, 100)
  @Transform((params) => params.value?.trim())
  title: string

  @IsNotEmpty()
  @MinLength(1)
  @Transform((params) => params.value?.trim())
  body: string
}
