import { IsDecimal, IsNotEmpty } from 'class-validator'

export class PaginationParams {
  @IsNotEmpty()
  @IsDecimal()
  page: number

  @IsNotEmpty()
  @IsDecimal()
  limit: number
}
