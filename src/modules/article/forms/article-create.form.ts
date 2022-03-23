import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty } from 'class-validator'

export class ArticleCreateForm {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  categoryId: number

  /**
   * This field will be assigned in controller due to the limitation of NodeJS
   */
  coverImage: Express.Multer.File

  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  body: string
}
