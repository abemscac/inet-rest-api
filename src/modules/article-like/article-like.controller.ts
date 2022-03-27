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
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { AccessTokenAuthGuard } from '../auth/guards/access-token.guard'
import { ArticleLike } from './article-like.entity'
import { ArticleLikeService } from './article-like.service'
import { ArticleLikeCreateForm } from './forms/article-like-create.form'
import { ArticleLikeFindOneByQueryParams } from './params/article-like-find-one-by-query.params'

@ApiTags('Article Likes')
@UseGuards(AccessTokenAuthGuard)
@Controller('article-likes')
export class ArticleLikeController {
  constructor(private readonly articleLikeService: ArticleLikeService) {}

  @ApiOperation({ summary: 'Find article like record by query' })
  @Get()
  async findOneByQuery(
    @Query() params: ArticleLikeFindOneByQueryParams,
  ): Promise<ArticleLike> {
    return await this.articleLikeService.findOneByQuery(params)
  }

  @ApiOperation({ summary: 'Like an article' })
  @Post()
  async create(@Body() form: ArticleLikeCreateForm): Promise<ArticleLike> {
    return await this.articleLikeService.create(form)
  }

  @ApiOperation({ summary: 'Take back like from an article' })
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOneByQuery(
    @Query() params: ArticleLikeFindOneByQueryParams,
  ): Promise<void> {
    return await this.articleLikeService.deleteOneByQuery(params)
  }
}
