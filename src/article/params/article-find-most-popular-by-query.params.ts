import { IsDateString } from 'class-validator'
import { PaginationParams } from 'src/shared-params/pagination.params'

export class ArticleFindMostPopularByQueryParams extends PaginationParams {
  @IsDateString()
  from?: Date
}
