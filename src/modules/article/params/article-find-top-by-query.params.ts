import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional } from 'class-validator'
import { PagableParams } from '~/shared-params/pagable.params'

export enum ArticleFindTopByQueryTimeInterval {
  today = 'today',
  week = 'week',
  month = 'month',
  year = 'year',
}

export class ArticleFindTopByQueryParams extends PagableParams {
  @IsEnum(ArticleFindTopByQueryTimeInterval)
  @IsOptional()
  interval?: ArticleFindTopByQueryTimeInterval

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  categoryId?: number
}
