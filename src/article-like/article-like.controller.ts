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
import { ArticleLike } from './article-like.entity'
import { ArticleLikeService } from './article-like.service'
import { ArticleLikeCreateForm } from './forms/article-like-create.form'
import { ArticleLikeDeleteByQueryParams } from './params/article-like-delete-by-query.params'
import { ArticleLikeFindByQueryParams } from './params/article-like-find-by-query.params'

@Controller('article-likes')
export class ArticleLikeController {
  constructor(private readonly articleLikeService: ArticleLikeService) {}

  @Get()
  async findOneByQuery(
    @Query() params: ArticleLikeFindByQueryParams,
  ): Promise<ArticleLike> {
    return await this.articleLikeService.findOneByQuery(params)
  }

  @Post()
  async create(@Body() form: ArticleLikeCreateForm): Promise<ArticleLike> {
    return await this.articleLikeService.create(form)
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOneByQuery(
    @Query() params: ArticleLikeDeleteByQueryParams,
  ): Promise<void> {
    await this.articleLikeService.deleteOneByQuery(params)
  }
}
