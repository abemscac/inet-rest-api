import { IsInt, IsNotEmpty } from 'class-validator'
import { PagableParams } from 'src/shared-params/pagable.params'

export class ArticleCommentFindByQueryParams extends PagableParams {
  @IsNotEmpty()
  @IsInt()
  articleId: number
}
