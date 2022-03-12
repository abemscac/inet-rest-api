import { Type } from 'class-transformer'
import { IsEnum, IsInt, Min } from 'class-validator'

export enum Pagination {
  default = 'default',
  cursor = 'cursor',
}

export class PagableParams {
  @IsEnum(Pagination)
  pagination?: Pagination

  @IsInt()
  @Type(() => Number)
  @Min(0)
  cursor?: number

  /**
   * 0-indexed page number
   */
  @IsInt()
  @Type(() => Number)
  @Min(0)
  page?: number

  @IsInt()
  @Type(() => Number)
  @Min(1)
  limit?: number
}
