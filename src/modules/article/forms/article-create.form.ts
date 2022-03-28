import { Transform, Type } from 'class-transformer'
import { IsInt, IsNotEmpty, Max } from 'class-validator'
import { ApiPropertyImage } from '~/swagger-decorators/api-property-image'

export class ArticleCreateForm {
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
  @Max(100)
  @Transform((params) => params.value?.trim())
  title: string

  @IsNotEmpty()
  @Transform((params) => params.value?.trim())
  body: string
}
