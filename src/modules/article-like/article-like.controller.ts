import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiCreatedExample } from '~/swagger-decorators/api-created-example'
import { ApiNoContentSuccess } from '~/swagger-decorators/api-no-content-success'
import { ApiOkExample } from '~/swagger-decorators/api-ok-example'
import { ApiWithAuth } from '~/swagger-decorators/api-with-auth'
import { ApiWithBodyFormat } from '~/swagger-decorators/api-with-body-format'
import { ApiWithQueryParamsFormat } from '~/swagger-decorators/api-with-query-params-format'
import { ApiWithTargetEntity } from '~/swagger-decorators/api-with-target-entity'
import { AccessTokenAuthGuard } from '../auth/guards/access-token.guard'
import { ArticleLike } from './article-like.entity'
import { MockArticleLike } from './article-like.mocks'
import { ArticleLikeService } from './article-like.service'
import { ArticleLikeCreateForm } from './forms/article-like-create.form'
import { ArticleLikeFindOneByQueryParams } from './params/article-like-find-one-by-query.params'

@ApiTags('Article Likes')
@UseGuards(AccessTokenAuthGuard)
@Controller('article-likes')
export class ArticleLikeController {
  constructor(private readonly articleLikeService: ArticleLikeService) {}

  @ApiOperation({ summary: 'Find article like record by query' })
  @ApiWithQueryParamsFormat()
  @ApiWithAuth()
  @ApiWithTargetEntity()
  @ApiOkExample(MockArticleLike)
  @Get()
  async findOneByQuery(
    @Query() params: ArticleLikeFindOneByQueryParams,
  ): Promise<ArticleLike> {
    return await this.articleLikeService.findOneByQuery(params)
  }

  @ApiOperation({ summary: 'Like an article' })
  @ApiWithBodyFormat()
  @ApiWithAuth()
  @ApiWithTargetEntity('article')
  @ApiCreatedExample(MockArticleLike)
  @Post()
  async create(@Body() form: ArticleLikeCreateForm): Promise<ArticleLike> {
    return await this.articleLikeService.create(form)
  }

  @ApiOperation({ summary: 'Take back like from an article' })
  @ApiWithQueryParamsFormat()
  @ApiWithAuth()
  @ApiWithTargetEntity()
  @ApiNoContentSuccess()
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOneByQuery(
    @Query() params: ArticleLikeFindOneByQueryParams,
  ): Promise<void> {
    return await this.articleLikeService.deleteOneByQuery(params)
  }
}
