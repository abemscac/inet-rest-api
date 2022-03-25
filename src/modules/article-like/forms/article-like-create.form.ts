import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty } from 'class-validator'

export class ArticleLikeCreateForm {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  articleId: number
}
