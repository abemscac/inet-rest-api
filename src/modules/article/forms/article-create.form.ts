import { Transform, Type } from 'class-transformer'
import { IsInt, IsNotEmpty } from 'class-validator'

export class ArticleCreateForm {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  categoryId: number

  /**
   * This field will be assigned in FastifyFileInterceptor
   */
  coverImage: Express.Multer.File

  @IsNotEmpty()
  @Transform((params) => params.value?.trim())
  title: string

  @IsNotEmpty()
  @Transform((params) => params.value?.trim())
  body: string
}
