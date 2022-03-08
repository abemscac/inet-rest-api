import { IsDateString } from 'class-validator'
import { CursorPagableParams } from 'src/shared-params/cursor-pagable.params'

export class ArticleFindMostPopularByQueryParams extends CursorPagableParams {
  @IsDateString()
  from?: Date
}
