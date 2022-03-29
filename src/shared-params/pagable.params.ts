import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsBoolean, IsEnum, IsInt, IsOptional, Min } from 'class-validator'
import { BooleanTransform } from '~/transforms/boolean.transform'

export enum Pagination {
  basic = 'basic',
  cursor = 'cursor',
}

export class PagableParams {
  @ApiPropertyOptional({ enum: Pagination, description: 'Paganation type.' })
  @IsEnum(Pagination)
  @IsOptional()
  pagination?: Pagination

  @ApiPropertyOptional({ description: 'The id of the cursor element.' })
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  cursor?: number

  /**
   * 0-indexed page number
   */
  @ApiPropertyOptional({ description: '0-indexed page number.' })
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  page?: number

  @ApiPropertyOptional({ description: 'Record count per page.' })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @IsOptional()
  limit?: number

  /**
   * Used to indicate that the client wants all records be returned at once.
   */
  @ApiPropertyOptional({
    description:
      'Used to indicate that the client wants all records be returned at once.',
  })
  @IsBoolean()
  @BooleanTransform()
  @IsOptional()
  FLAG_UNLIMITED?: boolean
}
