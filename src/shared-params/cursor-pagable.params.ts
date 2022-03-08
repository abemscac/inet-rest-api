import { IsDecimal } from 'class-validator'

export class CursorPagableParams {
  @IsDecimal()
  cursor?: number

  @IsDecimal()
  limit?: number
}
