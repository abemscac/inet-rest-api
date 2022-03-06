import { IsDateString } from 'class-validator'
import { PaginationParams } from 'src/shared-params/pagination.params'

export class ArticleFindMostPopularByQueryparams extends PaginationParams {
  @IsDateString()
  from?: Date
}
