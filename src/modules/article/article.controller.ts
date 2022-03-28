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
import { ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { FastifyImageFileInterceptor } from '~/interceptors/fastify-image-file.interceptor'
import { PagableParamsValidationPipe } from '~/pipes/pagable-params.validation.pipe'
import { IPagableViewModel } from '~/shared-view-models/i-pagable.view-model'
import { ApiAuthGuard } from '~/swagger-decorators/api-auth-guard'
import { ApiCreatedExample } from '~/swagger-decorators/api-created-example'
import { ApiMultipart } from '~/swagger-decorators/api-multipart'
import { ApiOkExample } from '~/swagger-decorators/api-ok-example'
import { ApiOkPagableExample } from '~/swagger-decorators/api-ok-pagable-example'
import { ApiPermittable } from '~/swagger-decorators/api-permittable'
import { IsPublic } from '../auth/decorators/is-public.decorator'
import { AccessTokenAuthGuard } from '../auth/guards/access-token.guard'
import { ArticleService } from './article.service'
import { ArticleCreateForm } from './forms/article-create.form'
import { ArticleUpdateForm } from './forms/article-update.form'
import {
  MockArticleViewModels,
  MockArticleViewModelsStripped,
} from './mocks/article-view-models.mocks'
import { ArticleFindTopByQueryParams } from './params/article-find-top-by-query.params'
import { IArticleViewModel } from './view-models/i-article.view-model'

@ApiTags('Articles')
@UseGuards(AccessTokenAuthGuard)
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ summary: 'Find top articles by query (pagable)' })
  @ApiOkPagableExample(MockArticleViewModelsStripped)
  @IsPublic()
  @Get('top')
  async findTopByQuery(
    @Query(PagableParamsValidationPipe)
    params: ArticleFindTopByQueryParams,
  ): Promise<IPagableViewModel<IArticleViewModel>> {
    return await this.articleService.findTopByQuery(params)
  }

  @ApiOperation({ summary: 'Find an article by id' })
  @ApiOkExample(MockArticleViewModels[0])
  @IsPublic()
  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IArticleViewModel> {
    return await this.articleService.findById(id)
  }

  @ApiOperation({ summary: 'Create an article' })
  @ApiAuthGuard()
  @ApiMultipart(ArticleCreateForm)
  @ApiCreatedExample(MockArticleViewModels[0])
  @Post()
  @FastifyImageFileInterceptor('coverImage', { required: true })
  async create(@Body() form: ArticleCreateForm): Promise<IArticleViewModel> {
    return await this.articleService.create(form)
  }

  @ApiOperation({ summary: 'Update an article by id' })
  @ApiPermittable()
  @ApiMultipart(ArticleUpdateForm)
  @ApiNoContentResponse({ description: 'Success' })
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
  @ApiPermittable()
  @ApiNoContentResponse({ description: 'Success' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeById(@Param('id', ParseIntPipe) id: number) {
    await this.articleService.removeById(id)
  }
}
