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
import { ApiBadRequestResponses } from '~/swagger-decorators/api-bad-request-responses'
import { ApiCreatedExample } from '~/swagger-decorators/api-created-example'
import { ApiNoContentSuccess } from '~/swagger-decorators/api-no-content-success'
import { ApiOkExample } from '~/swagger-decorators/api-ok-example'
import { ApiWithAuth } from '~/swagger-decorators/api-with-auth'
import { ApiWithTargetEntity } from '~/swagger-decorators/api-with-target-entity'
import { AccessTokenAuthGuard } from '../auth/guards/access-token.guard'
import { ArticleLike } from './article-like.entity'
import { MockArticleLike } from './article-like.mocks'
import { ArticleLikeService } from './article-like.service'
import { CreateArticleLikeForm } from './forms/create-article-like.form'
import { ArticleLikeQuery } from './queries/article-like.query'

@ApiTags('Article Likes')
@UseGuards(AccessTokenAuthGuard)
@Controller('article-likes')
export class ArticleLikeController {
  constructor(private readonly articleLikeService: ArticleLikeService) {}

  @ApiOperation({ summary: 'Find article like record by query' })
  @ApiBadRequestResponses({ queryFormat: true })
  @ApiWithAuth()
  @ApiWithTargetEntity()
  @ApiOkExample(MockArticleLike)
  @Get()
  async findByQuery(@Query() query: ArticleLikeQuery): Promise<ArticleLike> {
    return await this.articleLikeService.findOyQuery(query)
  }

  @ApiOperation({ summary: 'Like an article' })
  @ApiBadRequestResponses({ bodyFormat: true })
  @ApiWithAuth()
  @ApiWithTargetEntity('article')
  @ApiCreatedExample(MockArticleLike)
  @Post()
  async create(@Body() form: CreateArticleLikeForm): Promise<ArticleLike> {
    return await this.articleLikeService.create(form)
  }

  @ApiOperation({ summary: 'Take back like from an article' })
  @ApiBadRequestResponses({ queryFormat: true })
  @ApiWithAuth()
  @ApiWithTargetEntity()
  @ApiNoContentSuccess()
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOneByQuery(@Query() query: ArticleLikeQuery): Promise<void> {
    return await this.articleLikeService.deleteOneByQuery(query)
  }
}
