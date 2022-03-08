import { IsDecimal, IsNotEmpty } from 'class-validator'
import { CursorPagableParams } from 'src/shared-params/cursor-pagable.params'

export class ArticleCommentFindByQueryParams extends CursorPagableParams {
  @IsNotEmpty()
  @IsDecimal()
  articleId: number
}
