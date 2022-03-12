import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty } from 'class-validator'

export class ArticleLikeCreateForm {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  articleId: number
}
