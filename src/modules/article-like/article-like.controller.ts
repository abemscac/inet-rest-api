import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiBadRequestResponses } from '~/swagger-decorators/api-bad-request-responses'
import { ApiCreatedExample } from '~/swagger-decorators/api-created-example'
import { ApiNoContentSuccess } from '~/swagger-decorators/api-no-content-success'
import { ApiWithAuth } from '~/swagger-decorators/api-with-auth'
import { ApiWithPermit } from '~/swagger-decorators/api-with-permit'
import { ApiWithTargetEntity } from '~/swagger-decorators/api-with-target-entity'
import { AccessTokenAuthGuard } from '../auth/guards/access-token.guard'
import { ArticleLike } from './article-like.entity'
import { MockArticleLike } from './article-like.mocks'
import { ArticleLikeService } from './article-like.service'
import { CreateArticleLikeForm } from './forms/create-article-like.form'

@ApiTags('Article Likes')
@UseGuards(AccessTokenAuthGuard)
@Controller('article-likes')
export class ArticleLikeController {
  constructor(private readonly articleLikeService: ArticleLikeService) {}

  @ApiOperation({ summary: 'Like an article.' })
  @ApiBadRequestResponses({ bodyFormat: true })
  @ApiWithAuth()
  @ApiWithTargetEntity('article')
  @ApiCreatedExample(MockArticleLike)
  @Post()
  async create(@Body() form: CreateArticleLikeForm): Promise<ArticleLike> {
    return await this.articleLikeService.create(form)
  }

  @ApiOperation({ summary: 'Remove a like from an article.' })
  @ApiWithAuth()
  @ApiWithPermit()
  @ApiWithTargetEntity()
  @ApiNoContentSuccess()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.articleLikeService.deleteById(id)
  }
}
