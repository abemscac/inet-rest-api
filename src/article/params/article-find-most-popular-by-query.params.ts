import { IsDateString } from 'class-validator'
import { PagableParams } from 'src/shared-params/pagable.params'

export class ArticleFindMostPopularByQueryParams extends PagableParams {
  @IsDateString()
  from?: Date
}
