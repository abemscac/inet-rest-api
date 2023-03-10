import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, Min } from 'class-validator'

export class PagableQuery {
  /**
   * 0-indexed page number
   */
  @ApiProperty({ description: '0-indexed page number.' })
  @IsInt()
  @Type(() => Number)
  @Min(0)
  page: number

  @ApiProperty({ description: 'Row count per page.' })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  limit: number
}
