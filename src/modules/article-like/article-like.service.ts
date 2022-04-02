import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TypeORMUtil } from '~/utils/typeorm.util'
import { PassportPermitService } from '../passport-permit/passport-permit.service'
import { ArticleLike } from './article-like.entity'
import { CreateArticleLikeForm } from './forms/create-article-like.form'
import { ArticleLikeQuery } from './queries/article-like.query'

export interface IArticleLikeService {
  findOyQuery(query: ArticleLikeQuery): Promise<ArticleLike>
  create(form: CreateArticleLikeForm): Promise<ArticleLike>
  deleteOneByQuery(query: ArticleLikeQuery): Promise<void>
}

@Injectable()
export class ArticleLikeService implements IArticleLikeService {
  constructor(
    @InjectRepository(ArticleLike)
    private readonly articleLikeRepository: Repository<ArticleLike>,
    private readonly passportPermitService: PassportPermitService,
  ) {}

  async findOyQuery(query: ArticleLikeQuery): Promise<ArticleLike> {
    const { articleId } = query
    return await this.articleLikeRepository.findOneOrFail({
      where: {
        articleId,
        userId: this.passportPermitService.user?.id,
      },
    })
  }

  async create(query: CreateArticleLikeForm): Promise<ArticleLike> {
    const { articleId } = query
    const userId = this.passportPermitService.user?.id
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

  async deleteOneByQuery(query: ArticleLikeQuery): Promise<void> {
    const { articleId } = query
    const userId = this.passportPermitService.user?.id
    await TypeORMUtil.existOrFail(this.articleLikeRepository, {
      userId,
      articleId,
    })
    await this.articleLikeRepository.delete({
      userId,
      articleId,
    })
  }
}
