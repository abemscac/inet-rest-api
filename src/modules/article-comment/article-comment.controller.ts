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
import { AccessTokenAuthGuard } from '../auth/guards/access-token.guard'
import { ArticleCommentService } from './article-comment.service'
import { ArticleCommentCreateForm } from './forms/article-comment-create.form'
import { ArticleCommentFindByQueryParams } from './params/article-comment-find-by-query.params'
import { IArticleCommentViewModel } from './view-models/i-article-comment.view-model'

@Controller('article-comments')
export class ArticleCommentController {
  constructor(private readonly articleCommentService: ArticleCommentService) {}

  @Get()
  findByQuery(
    @Query(PagableParamsValidationPipe) params: ArticleCommentFindByQueryParams,
  ): Promise<IPagableViewModel<IArticleCommentViewModel>> {
    return this.articleCommentService.findByQuery(params)
  }

  @UseGuards(AccessTokenAuthGuard)
  @Post()
  create(
    @Body() form: ArticleCommentCreateForm,
  ): Promise<IArticleCommentViewModel> {
    return this.articleCommentService.create(form)
  }

  @UseGuards(AccessTokenAuthGuard)
  @Delete(':id')
  removeById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.articleCommentService.removeById(id)
  }
}
