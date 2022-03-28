import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsBoolean, IsEnum, IsInt, IsOptional, Min } from 'class-validator'
import { BooleanTransform } from '~/transforms/boolean.transform'

export enum Pagination {
  basic = 'basic',
  cursor = 'cursor',
}

export class PagableParams {
  @ApiPropertyOptional({ enum: Pagination })
  @IsEnum(Pagination)
  @IsOptional()
  pagination?: Pagination

  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  cursor?: number

  /**
   * 0-indexed page number
   */
  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  page?: number

  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @IsOptional()
  limit?: number

  /**
   * Used to indicate that API should return all records at once.
   */
  @ApiPropertyOptional()
  @IsBoolean()
  @BooleanTransform()
  @IsOptional()
  FLAG_UNLIMITED?: boolean
}
