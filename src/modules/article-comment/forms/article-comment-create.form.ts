import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty } from 'class-validator'

export class ArticleCommentCreateForm {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  articleId: number

  @IsNotEmpty()
  body: string
}
