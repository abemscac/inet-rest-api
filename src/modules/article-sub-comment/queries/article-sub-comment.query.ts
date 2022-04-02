import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty } from 'class-validator'
import { PagableQuery } from '~/shared-queries/pagable.query'

export class ArticleSubCommentQuery extends PagableQuery {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  parentCommentId: number
}
