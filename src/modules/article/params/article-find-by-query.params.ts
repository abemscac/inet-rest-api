import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional } from 'class-validator'
import { PagableParams } from '~/shared-params/pagable.params'

export enum ArticleCreatedWithin {
  today = 'today',
  week = 'week',
  month = 'month',
  year = 'year',
}

export class ArticleFindByQueryParams extends PagableParams {
  @ApiPropertyOptional({
    enum: ArticleCreatedWithin,
    description: 'The time range articles were created.',
  })
  @IsEnum(ArticleCreatedWithin)
  @IsOptional()
  createdWithin?: ArticleCreatedWithin

  @ApiPropertyOptional({
    description: 'Id of the article-category the articles belong to.',
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  categoryId?: number

  keyword?: string
}
