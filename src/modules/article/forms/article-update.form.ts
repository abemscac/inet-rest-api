import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty } from 'class-validator'

export class ArticleUpdateForm {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  categoryId: number

  /**
   * This field will be assigned in FastifyFileInterceptor
   */
  coverImage?: Express.Multer.File

  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  body: string
}
