import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ArticleLike } from './article-like.entity'
import { ArticleLikeCreateForm } from './forms/article-like-create.form'
import { IArticleLikeService } from './i-article-like.service'
import { ArticleLikeDeleteByQueryParams } from './params/article-like-delete-by-query.params'
import { ArticleLikeFindByQueryParams } from './params/article-like-find-by-query.params'

@Injectable()
export class ArticleLikeService implements IArticleLikeService {
  constructor(
    @InjectRepository(ArticleLike)
    private readonly articleLikeRepository: Repository<ArticleLike>,
  ) {}

  findOneByQuery({
    articleId,
    userId,
  }: ArticleLikeFindByQueryParams): Promise<ArticleLike> {
    return this.articleLikeRepository.findOneOrFail({
      where: {
        articleId: articleId,
        userId: userId,
      },
      select: ['articleId', 'userId', 'createdAt'],
    })
  }

  async create({
    articleId,
    userId,
  }: ArticleLikeCreateForm): Promise<ArticleLike> {
    const prevEntity = await this.articleLikeRepository.findOne({
      articleId,
      userId,
    })
    if (prevEntity) {
      return prevEntity
    }

    const newEntity = this.articleLikeRepository.create({
      articleId,
      userId,
    })
    await this.articleLikeRepository.save(newEntity)
    return newEntity
  }

  async deleteOneByQuery(
    params: ArticleLikeDeleteByQueryParams,
  ): Promise<void> {
    const result = await this.articleLikeRepository.delete(params)
    if (!result.affected) {
      throw new NotFoundException()
    }
  }
}
