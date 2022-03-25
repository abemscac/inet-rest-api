import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty } from 'class-validator'

export class ArticleLikeFindOneByQueryParams {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  articleId: number
}
