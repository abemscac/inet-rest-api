import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, Length } from 'class-validator'
import { UsernameRegexp } from '~/modules/auth/auth.constants'
import { PagableQuery } from '~/shared-queries/pagable.query'
import { ApiPropertyWithRegexp } from '~/swagger-decorators/api-property-with-regexp'

export enum ArticleCreatedWithin {
  today = 'today',
  week = 'week',
  month = 'month',
  year = 'year',
}

export class ArticleQuery extends PagableQuery {
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

  @ApiPropertyOptional({
    description: 'Partial title or author name.',
  })
  @IsOptional()
  keyword?: string

  @ApiPropertyWithRegexp(UsernameRegexp, {
    optional: true,
  })
  @Length(4, 50)
  @IsOptional()
  authorUsername?: string
}
