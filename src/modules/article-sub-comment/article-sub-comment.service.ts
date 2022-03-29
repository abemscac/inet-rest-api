import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { IPagableViewModel } from '~/shared-view-models/i-pagable.view-model'
import { TypeORMUtil } from '~/utils/typeorm.util'
import { ArticleComment } from '../article-comment/article-comment.entity'
import { IArticleCommentViewModel } from '../article-comment/view-models/i-article-comment.view-model'
import { PassportPermitService } from '../passport-permit/passport-permit.service'
import { ArticleSubComment } from './article-sub-comment.entity'
import { ArticleSubCommentCreateForm } from './forms/article-sub-comment-create.form'
import { ArticleSubCommentFindByQueryParams } from './params/article-sub-comment-find-by-query.params'
import { ArticleSubCommentProjector } from './projectors/article-sub-comment.projector'

export interface IArticleSubCommentService {
  findByQuery(
    params: ArticleSubCommentFindByQueryParams,
  ): Promise<IPagableViewModel<IArticleCommentViewModel>>
  create(form: ArticleSubCommentCreateForm): Promise<IArticleCommentViewModel>
  removeById(id: number): Promise<void>
}

@Injectable()
export class ArticleSubCommentService implements IArticleSubCommentService {
  constructor(
    @InjectRepository(ArticleSubComment)
    private readonly articleSubCommentRepository: Repository<ArticleSubComment>,
    @InjectRepository(ArticleComment)
    private readonly articleCommentRepository: Repository<ArticleComment>,
    private readonly passportPermitService: PassportPermitService,
  ) {}

  async findByQuery(
    params: ArticleSubCommentFindByQueryParams,
  ): Promise<IPagableViewModel<IArticleCommentViewModel>> {
    return await new ArticleSubCommentProjector(
      this.articleSubCommentRepository,
      'comment',
    )
      .where('comment.parentCommentId = :parentCommentId', {
        parentCommentId: params.parentCommentId,
      })
      .orderBy('comment.id', 'ASC')
      .projectPagination(params)
  }

  async create(
    form: ArticleSubCommentCreateForm,
  ): Promise<IArticleCommentViewModel> {
    await TypeORMUtil.existOrFail(this.articleCommentRepository, {
      id: form.parentCommentId,
      isRemoved: false,
    })
    const subComment = this.articleSubCommentRepository.create({
      parentCommentId: form.parentCommentId,
      authorId: this.passportPermitService.user?.id,
      body: form.body,
    })
    await this.articleSubCommentRepository.insert(subComment)
    return await new ArticleSubCommentProjector(
      this.articleSubCommentRepository,
      'comment',
    )
      .where('comment.id = :id', { id: subComment.id })
      .project()
  }

  async removeById(id: number): Promise<void> {
    const comment = await this.articleSubCommentRepository.findOneOrFail(
      { id, isRemoved: false },
      {
        select: ['authorId'],
      },
    )
    this.passportPermitService.permitOrFail(comment.authorId)
    await this.articleSubCommentRepository.update(
      { id },
      {
        isRemoved: true,
        removedAt: new Date(),
      },
    )
  }
}
