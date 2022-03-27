import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty } from 'class-validator'
import { ApiPropertyImage } from '~/swagger-decorators/api-property-image'

export class ArticleUpdateForm {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  categoryId: number

  /**
   * This field will be assigned in FastifyFileInterceptor
   */
  @ApiPropertyImage()
  coverImage?: Express.Multer.File

  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  body: string
}
