import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty } from 'class-validator'

export class ArticleLikeFindOneByQueryParams {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  articleId: number
}
