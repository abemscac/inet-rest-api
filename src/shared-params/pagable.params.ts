import { IsDecimal, IsEnum, Min } from 'class-validator'

export enum Pagination {
  default = 'default',
  cursor = 'cursor',
}

export class PagableParams {
  @IsEnum(Pagination)
  pagination?: Pagination

  @IsDecimal()
  @Min(0)
  cursor?: number

  /**
   * 0-indexed page number
   */
  @IsDecimal()
  @Min(0)
  page?: number

  @IsDecimal()
  @Min(1)
  limit?: number
}
