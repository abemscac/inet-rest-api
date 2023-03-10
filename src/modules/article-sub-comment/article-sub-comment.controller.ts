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
import { IPaginationViewModel } from '~/shared-view-models/i-pagination.view-model'
import { ApiBadRequestResponses } from '~/swagger-decorators/api-bad-request-responses'
import { ApiCreatedExample } from '~/swagger-decorators/api-created-example'
import { ApiNoContentSuccess } from '~/swagger-decorators/api-no-content-success'
import { ApiOkPagableExample } from '~/swagger-decorators/api-ok-pagable-example'
import { ApiWithAuth } from '~/swagger-decorators/api-with-auth'
import { ApiWithPermit } from '~/swagger-decorators/api-with-permit'
import { ApiWithTargetEntity } from '~/swagger-decorators/api-with-target-entity'
import { MockArticleComments } from '../article-comment/article-comment.mocks'
import { IArticleCommentViewModel } from '../article-comment/view-models/i-article-comment.view-model'
import { AccessTokenAuthGuard } from '../auth/guards/access-token.guard'
import { ArticleSubCommentService } from './article-sub-comment.service'
import { CreateArticleSubCommentForm } from './forms/create-article-sub-comment.form'
import { ArticleSubCommentQuery } from './queries/article-sub-comment.query'

@ApiTags('Article Sub Comments')
@Controller('article-sub-comments')
export class ArticleSubCommentController {
  constructor(
    private readonly articleSubCommentService: ArticleSubCommentService,
  ) {}

  @ApiOperation({ summary: 'Find article sub-comments by query (pagable)' })
  @ApiBadRequestResponses({ queryFormat: true })
  @ApiWithTargetEntity('parent-comment')
  @ApiOkPagableExample(MockArticleComments)
  @Get()
  async findByQuery(
    @Query()
    query: ArticleSubCommentQuery,
  ): Promise<IPaginationViewModel<IArticleCommentViewModel>> {
    return await this.articleSubCommentService.findByQuery(query)
  }

  @ApiOperation({ summary: 'Create an article sub-comment' })
  @ApiWithAuth()
  @ApiBadRequestResponses({ bodyFormat: true })
  @ApiWithTargetEntity('parent-comment')
  @ApiCreatedExample(MockArticleComments[0])
  @UseGuards(AccessTokenAuthGuard)
  @Post()
  async create(
    @Body() form: CreateArticleSubCommentForm,
  ): Promise<IArticleCommentViewModel> {
    return await this.articleSubCommentService.create(form)
  }

  @ApiOperation({ summary: 'Delete an article sub-comment by id' })
  @ApiWithAuth()
  @ApiWithPermit()
  @ApiWithTargetEntity('sub-comment')
  @ApiNoContentSuccess()
  @UseGuards(AccessTokenAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.articleSubCommentService.removeById(id)
  }
}
