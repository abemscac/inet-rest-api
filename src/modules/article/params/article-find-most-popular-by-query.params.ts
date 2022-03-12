import { Type } from 'class-transformer'
import { IsDateString, IsOptional } from 'class-validator'
import { PagableParams } from 'src/shared-params/pagable.params'

export class ArticleFindMostPopularByQueryParams extends PagableParams {
  @IsDateString()
  @Type(() => Date)
  @IsOptional()
  from?: Date
}
