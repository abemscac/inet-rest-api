import { Type } from 'class-transformer'
import { IsBoolean, IsEnum, IsInt, IsOptional, Min } from 'class-validator'
import { BooleanTransform } from '~/transforms/boolean.transform'

export enum Pagination {
  default = 'default',
  cursor = 'cursor',
}

export class PagableParams {
  @IsEnum(Pagination)
  @IsOptional()
  pagination?: Pagination

  @IsInt()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  cursor?: number

  /**
   * 0-indexed page number
   */
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  page?: number

  @IsInt()
  @Type(() => Number)
  @Min(1)
  @IsOptional()
  limit?: number

  /**
   * Used to indicate that API should return all records at once.
   */
  @IsBoolean()
  @BooleanTransform()
  @IsOptional()
  FLAG_UNLIMITED?: boolean
}
