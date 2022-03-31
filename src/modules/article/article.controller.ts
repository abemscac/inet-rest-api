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
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { FastifyImageFileInterceptor } from '~/interceptors/fastify-image-file.interceptor'
import { PagableParamsValidationPipe } from '~/pipes/pagable-params.validation.pipe'
import { IPagableViewModel } from '~/shared-view-models/i-pagable.view-model'
import { ApiBadRequestResponses } from '~/swagger-decorators/api-bad-request-responses'
import { ApiCreatedExample } from '~/swagger-decorators/api-created-example'
import { ApiMultipart } from '~/swagger-decorators/api-multipart'
import { ApiNoContentSuccess } from '~/swagger-decorators/api-no-content-success'
import { ApiOkExample } from '~/swagger-decorators/api-ok-example'
import { ApiOkPagableExample } from '~/swagger-decorators/api-ok-pagable-example'
import { ApiWithAuth } from '~/swagger-decorators/api-with-auth'
import { ApiWithPermit } from '~/swagger-decorators/api-with-permit'
import { ApiWithTargetEntity } from '~/swagger-decorators/api-with-target-entity'
import { IsPublic } from '../auth/decorators/is-public.decorator'
import { AccessTokenAuthGuard } from '../auth/guards/access-token.guard'
import { ArticleErrors } from './article.errors'
import {
  MockArticleViewModels,
  MockArticleViewModelsStripped,
} from './article.mocks'
import { ArticleService } from './article.service'
import { ArticleCreateForm } from './forms/article-create.form'
import { ArticleUpdateForm } from './forms/article-update.form'
import { ArticleFindByQueryParams } from './params/article-find-by-query.params'
import { ARTICLE_BODY_PREVIEW_LENGTH } from './projectors/article.projector'
import { IArticleViewModel } from './view-models/i-article.view-model'

@ApiTags('Articles')
@UseGuards(AccessTokenAuthGuard)
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ summary: 'Find top articles by query (pagable)' })
  @ApiBadRequestResponses({
    queryFormat: true,
    businessLogicErrors: [ArticleErrors.CategoryDoesNotExist],
  })
  @ApiOkPagableExample(
    MockArticleViewModelsStripped,
    `The <code>body</code> will only contain the first ${ARTICLE_BODY_PREVIEW_LENGTH} characters.`,
  )
  @IsPublic()
  @Get()
  async findByQuery(
    @Query(PagableParamsValidationPipe)
    params: ArticleFindByQueryParams,
  ): Promise<IPagableViewModel<IArticleViewModel>> {
    return await this.articleService.findByQuery(params)
  }

  @ApiOperation({ summary: 'Find an article by id' })
  @ApiWithTargetEntity('article')
  @ApiOkExample(MockArticleViewModels[0])
  @IsPublic()
  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IArticleViewModel> {
    return await this.articleService.findById(id)
  }

  @ApiOperation({ summary: 'Create an article' })
  @ApiMultipart()
  @ApiWithAuth()
  @ApiBadRequestResponses({ bodyFormat: true })
  @ApiCreatedExample(MockArticleViewModels[0])
  @Post()
  @FastifyImageFileInterceptor('coverImage', { required: true })
  async create(@Body() form: ArticleCreateForm): Promise<IArticleViewModel> {
    return await this.articleService.create(form)
  }

  @ApiOperation({ summary: 'Update an article by id' })
  @ApiMultipart()
  @ApiWithAuth()
  @ApiWithPermit()
  @ApiBadRequestResponses({ bodyFormat: true })
  @ApiWithTargetEntity('article')
  @ApiNoContentSuccess()
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @FastifyImageFileInterceptor('coverImage', { required: false })
  async updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() form: ArticleUpdateForm,
  ): Promise<void> {
    await this.articleService.updateById(id, form)
  }

  @ApiOperation({ summary: 'Delete an article by id' })
  @ApiWithAuth()
  @ApiWithPermit()
  @ApiWithTargetEntity('article')
  @ApiNoContentSuccess()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeById(@Param('id', ParseIntPipe) id: number) {
    await this.articleService.removeById(id)
  }
}
