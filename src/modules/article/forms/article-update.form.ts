import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty } from 'class-validator'

export class ArticleUpdateForm {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  categoryId: number

  @IsNotEmpty()
  coverImageUrl: string

  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  body: string
}
