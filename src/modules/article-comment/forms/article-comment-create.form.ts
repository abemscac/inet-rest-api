import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty } from 'class-validator'

export class ArticleCommentCreateForm {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  articleId: number

  @IsNotEmpty()
  body: string
}
