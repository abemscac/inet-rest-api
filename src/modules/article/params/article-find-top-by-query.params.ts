import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional } from 'class-validator'
import { PagableParams } from '~/shared-params/pagable.params'

export enum ArticleCreatedRange {
  today = 'today',
  week = 'week',
  month = 'month',
  year = 'year',
}

export class ArticleFindTopByQueryParams extends PagableParams {
  @ApiPropertyOptional({
    enum: ArticleCreatedRange,
    description: 'The time range articles were created.',
  })
  @IsEnum(ArticleCreatedRange)
  @IsOptional()
  created?: ArticleCreatedRange

  @ApiPropertyOptional({
    description: 'Id of the article-category the articles belong to.',
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  categoryId?: number
}
