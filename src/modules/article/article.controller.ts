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
import { PagableParamsValidationPipe } from 'src/pipes/pagable-params.validation.pipe'
import { IPagableViewModel } from 'src/shared-view-models/i-pagable.view-model'
import { IsPublic } from '../auth/decorators/is-public.decorator'
import { AccessTokenAuthGuard } from '../auth/guards/access-token.guard'
import { ArticleService } from './article.service'
import { ArticleCreateForm } from './forms/article-create.form'
import { ArticleUpdateForm } from './forms/article-update.form'
import { ArticleFindMostPopularByQueryParams } from './params/article-find-most-popular-by-query.params'
import { IArticleSummaryViewModel } from './view-models/i-article-summary.view-model'
import { IArticleViewModel } from './view-models/i-article.view-model'

@UseGuards(AccessTokenAuthGuard)
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @IsPublic()
  @Get('most-popular')
  async findMostPopularByQuery(
    @Query(PagableParamsValidationPipe)
    params: ArticleFindMostPopularByQueryParams,
  ): Promise<IPagableViewModel<IArticleSummaryViewModel>> {
    return await this.articleService.findMostPopularByQuery(params)
  }

  @IsPublic()
  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IArticleViewModel> {
    return await this.articleService.findById(id)
  }

  @Post()
  async create(@Body() form: ArticleCreateForm): Promise<IArticleViewModel> {
    return await this.articleService.create(form)
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() form: ArticleUpdateForm,
  ): Promise<void> {
    await this.articleService.updateById(id, form)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeById(@Param('id', ParseIntPipe) id: number) {
    await this.articleService.removeById(id)
  }
}
