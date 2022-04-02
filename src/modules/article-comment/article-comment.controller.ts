import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { PagableQueryValidationPipe } from '~/pipes/pagable-query.validation.pipe'
import { IPagableViewModel } from '~/shared-view-models/i-pagable.view-model'
import { ApiBadRequestResponses } from '~/swagger-decorators/api-bad-request-responses'
import { ApiCreatedExample } from '~/swagger-decorators/api-created-example'
import { ApiNoContentSuccess } from '~/swagger-decorators/api-no-content-success'
import { ApiOkPagableExample } from '~/swagger-decorators/api-ok-pagable-example'
import { ApiWithAuth } from '~/swagger-decorators/api-with-auth'
import { ApiWithPermit } from '~/swagger-decorators/api-with-permit'
import { ApiWithTargetEntity } from '~/swagger-decorators/api-with-target-entity'
import { AccessTokenAuthGuard } from '../auth/guards/access-token.guard'
import { MockArticleCommentViewModels } from './article-comment.mocks'
import { ArticleCommentService } from './article-comment.service'
import { CreateArticleCommentForm } from './forms/create-article-comment.form'
import { ArticleCommentQuery } from './queries/article-comment.query'
import { IArticleCommentViewModel } from './view-models/i-article-comment.view-model'

@ApiTags('Article Comments')
@Controller('article-comments')
export class ArticleCommentController {
  constructor(private readonly articleCommentService: ArticleCommentService) {}

  @ApiOperation({ summary: 'Find article comments by query (pagable)' })
  @ApiBadRequestResponses({ queryFormat: true })
  @ApiWithTargetEntity('article')
  @ApiOkPagableExample(MockArticleCommentViewModels)
  @Get()
  async findByQuery(
    @Query(PagableQueryValidationPipe) query: ArticleCommentQuery,
  ): Promise<IPagableViewModel<IArticleCommentViewModel>> {
    return await this.articleCommentService.findByQuery(query)
  }

  @ApiOperation({ summary: 'Create an article comment' })
  @ApiWithAuth()
  @ApiBadRequestResponses({ bodyFormat: true })
  @ApiWithTargetEntity('article')
  @ApiCreatedExample(MockArticleCommentViewModels[0])
  @UseGuards(AccessTokenAuthGuard)
  @Post()
  async create(
    @Body() form: CreateArticleCommentForm,
  ): Promise<IArticleCommentViewModel> {
    return await this.articleCommentService.create(form)
  }

  @ApiOperation({ summary: 'Delete an article comment by id' })
  @ApiWithAuth()
  @ApiWithPermit()
  @ApiWithTargetEntity()
  @ApiNoContentSuccess()
  @UseGuards(AccessTokenAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.articleCommentService.removeById(id)
  }
}
