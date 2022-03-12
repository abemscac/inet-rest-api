import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty } from 'class-validator'
import { PagableParams } from 'src/shared-params/pagable.params'

export class ArticleCommentFindByQueryParams extends PagableParams {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  articleId: number
}
