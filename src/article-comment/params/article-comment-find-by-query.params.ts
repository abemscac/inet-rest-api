import { IsDecimal, IsNotEmpty } from 'class-validator'
import { PaginationParams } from 'src/shared-params/pagination.params'

export class ArticleCommentFindByQueryParams extends PaginationParams {
  @IsNotEmpty()
  @IsDecimal()
  articleId: number
}
