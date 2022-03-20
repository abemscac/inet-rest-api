import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { PagableParamsValidationPipe } from 'src/pipes/pagable-params.validation.pipe'
import { IPagableViewModel } from 'src/shared-view-models/i-pagable.view-model'
import { IsPublic } from '../auth/decorators/is-public.decorator'
import { AccessTokenAuthGuard } from '../auth/guards/access-token.guard'
import { ArticleCommentService } from './article-comment.service'
import { ArticleCommentCreateForm } from './forms/article-comment-create.form'
import { ArticleCommentFindByQueryParams } from './params/article-comment-find-by-query.params'
import { IArticleCommentViewModel } from './view-models/i-article-comment.view-model'

@UseGuards(AccessTokenAuthGuard)
@Controller('article-comments')
export class ArticleCommentController {
  constructor(private readonly articleCommentService: ArticleCommentService) {}

  @IsPublic()
  @Get()
  async findByQuery(
    @Query(PagableParamsValidationPipe) params: ArticleCommentFindByQueryParams,
  ): Promise<IPagableViewModel<IArticleCommentViewModel>> {
    return await this.articleCommentService.findByQuery(params)
  }

  @Post()
  async create(
    @Body() form: ArticleCommentCreateForm,
  ): Promise<IArticleCommentViewModel> {
    return await this.articleCommentService.create(form)
  }

  @Delete(':id')
  async removeById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.articleCommentService.removeById(id)
  }
}
