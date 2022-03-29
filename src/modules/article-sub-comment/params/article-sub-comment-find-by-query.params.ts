import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty } from 'class-validator'
import { PagableParams } from '~/shared-params/pagable.params'

export class ArticleSubCommentFindByQueryParams extends PagableParams {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  parentCommentId: number
}
