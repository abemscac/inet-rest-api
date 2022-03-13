import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseService, IBaseService } from 'src/base-services/base.service'
import { Repository } from 'typeorm'
import { PassportPermitService } from '../passport-permit/passport-permit.service'
import { ArticleLike } from './article-like.entity'
import { ArticleLikeCreateForm } from './forms/article-like-create.form'
import { ArticleLikeFindOneByQueryParams } from './params/article-like-find-one-by-query.params'

export interface IArticleLikeService extends IBaseService {
  findOneByQuery(params: ArticleLikeFindOneByQueryParams): Promise<ArticleLike>
  create(form: ArticleLikeCreateForm): Promise<ArticleLike>
  deleteOneByQuery(params: ArticleLikeFindOneByQueryParams): Promise<void>
}

@Injectable()
export class ArticleLikeService
  extends BaseService
  implements IArticleLikeService
{
  constructor(
    @InjectRepository(ArticleLike)
    private readonly articleLikeRepository: Repository<ArticleLike>,
    private readonly passportPermitService: PassportPermitService,
  ) {
    super()
  }

  findOneByQuery({
    articleId,
  }: ArticleLikeFindOneByQueryParams): Promise<ArticleLike> {
    return this.articleLikeRepository.findOneOrFail({
      where: {
        articleId,
        userId: this.passportPermitService.user.id,
      },
    })
  }

  async create({ articleId }: ArticleLikeCreateForm): Promise<ArticleLike> {
    const userId = this.passportPermitService.user.id
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
    await this.articleLikeRepository.insert(newEntity)
    return newEntity
  }

  async deleteOneByQuery({
    articleId,
  }: ArticleLikeFindOneByQueryParams): Promise<void> {
    const result = await this.articleLikeRepository.delete({
      articleId,
      userId: this.passportPermitService.user.id,
    })
    if (!result.affected) {
      throw new NotFoundException()
    }
  }
}
