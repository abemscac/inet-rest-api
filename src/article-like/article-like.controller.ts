import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common'
import { ArticleLikeService } from './article-like.service'
import { ArticleLikeCreateForm } from './forms/article-like-create.form'
import { ArticleLikeDeleteByQueryParams } from './params/article-like-delete-by-query.params'
import { ArticleLikeFindByQueryParams } from './params/article-like-find-by-query.params'
import { IArticleLikeViewModel } from './view-models/i-article-like.view-model'

@Controller('article-likes')
export class ArticleLikeController {
  constructor(private readonly articleLikeService: ArticleLikeService) {}

  @Get()
  async findByQuery(
    @Query() params: ArticleLikeFindByQueryParams,
  ): Promise<IArticleLikeViewModel> {
    return await this.articleLikeService.findByQuery(params)
  }

  @Post()
  async create(
    @Body() form: ArticleLikeCreateForm,
  ): Promise<IArticleLikeViewModel> {
    return await this.articleLikeService.create(form)
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteByQuery(
    @Query() params: ArticleLikeDeleteByQueryParams,
  ): Promise<void> {
    await this.articleLikeService.deleteByQuery(params)
  }
}
