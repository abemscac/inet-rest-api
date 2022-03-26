import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty } from 'class-validator'
import { PagableParams } from '~/shared-params/pagable.params'

export class ArticleCommentFindByQueryParams extends PagableParams {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  articleId: number
}
