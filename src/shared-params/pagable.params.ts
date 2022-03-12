import { IsEnum, IsInt, Min } from 'class-validator'

export enum Pagination {
  default = 'default',
  cursor = 'cursor',
}

export class PagableParams {
  @IsEnum(Pagination)
  pagination?: Pagination

  @IsInt()
  @Min(0)
  cursor?: number

  /**
   * 0-indexed page number
   */
  @IsInt()
  @Min(0)
  page?: number

  @IsInt()
  @Min(1)
  limit?: number
}
