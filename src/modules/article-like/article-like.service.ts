import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PassportPermitService } from '../passport-permit/passport-permit.service'
import { ArticleLike } from './article-like.entity'
import { CreateArticleLikeForm } from './forms/create-article-like.form'

export interface IArticleLikeService {
  create(form: CreateArticleLikeForm): Promise<ArticleLike>
  deleteById(id: number): Promise<void>
}

@Injectable()
export class ArticleLikeService implements IArticleLikeService {
  constructor(
    @InjectRepository(ArticleLike)
    private readonly articleLikeRepository: Repository<ArticleLike>,
    private readonly passportPermitService: PassportPermitService,
  ) {}

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

  async deleteById(id: number): Promise<void> {
    const record = await this.articleLikeRepository.findOneOrFail(id, {
      select: ['userId'],
    })
    this.passportPermitService.permitOrFail(record.userId)
    await this.articleLikeRepository.delete({ id })
  }
}
