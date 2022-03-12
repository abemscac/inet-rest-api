import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { AccessTokenAuthGuard } from '../auth/guards/access-token.guard'
import { ArticleLike } from './article-like.entity'
import { ArticleLikeService } from './article-like.service'
import { ArticleLikeCreateForm } from './forms/article-like-create.form'
import { ArticleLikeFindOneByQueryParams } from './params/article-like-find-one-by-query.params'

@UseGuards(AccessTokenAuthGuard)
@Controller('article-likes')
export class ArticleLikeController {
  constructor(private readonly articleLikeService: ArticleLikeService) {}

  @Get()
  async findOneByQuery(
    @Query() params: ArticleLikeFindOneByQueryParams,
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
    @Query() params: ArticleLikeFindOneByQueryParams,
  ): Promise<void> {
    await this.articleLikeService.deleteOneByQuery(params)
  }
}
