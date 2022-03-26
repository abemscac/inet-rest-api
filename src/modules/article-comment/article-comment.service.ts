import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { IPagableViewModel } from '~/shared-view-models/i-pagable.view-model'
import { TypeORMUtil } from '~/utils/typeorm.util'
import { Article } from '../article/article.entity'
import { PassportPermitService } from '../passport-permit/passport-permit.service'
import { ArticleComment } from './article-comment.entity'
import { ArticleCommentCreateForm } from './forms/article-comment-create.form'
import { ArticleCommentFindByQueryParams } from './params/article-comment-find-by-query.params'
import { ArticleCommentProjector } from './projectors/article-comment.projector'
import { IArticleCommentViewModel } from './view-models/i-article-comment.view-model'

export interface IArticleCommentService {
  findByQuery(
    params: ArticleCommentFindByQueryParams,
  ): Promise<IPagableViewModel<IArticleCommentViewModel>>
  create(form: ArticleCommentCreateForm): Promise<IArticleCommentViewModel>
  removeById(id: number): Promise<void>
}

@Injectable()
export class ArticleCommentService implements IArticleCommentService {
  constructor(
    @InjectRepository(ArticleComment)
    private readonly articleCommentRepository: Repository<ArticleComment>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly passportPermitService: PassportPermitService,
  ) {}

  async findByQuery(
    params: ArticleCommentFindByQueryParams,
  ): Promise<IPagableViewModel<IArticleCommentViewModel>> {
    const { articleId } = params
    return await new ArticleCommentProjector(
      this.articleCommentRepository,
      'comment',
    )
      .where('comment.articleId = :articleId', { articleId })
      .orderBy('comment.id', 'ASC')
      .projectPagination(params)
  }

  async create(
    form: ArticleCommentCreateForm,
  ): Promise<IArticleCommentViewModel> {
    await TypeORMUtil.existOrFail(this.articleRepository, {
      id: form.articleId,
      isRemoved: false,
    })
    const comment = this.articleCommentRepository.create({
      articleId: form.articleId,
      authorId: this.passportPermitService.user?.id,
      body: form.body,
    })
    await this.articleCommentRepository.insert(comment)
    return await new ArticleCommentProjector(
      this.articleCommentRepository,
      'comment',
    )
      .where('comment.id = :id', { id: comment.id })
      .project()
  }

  async removeById(id: number): Promise<void> {
    const comment = await this.articleCommentRepository.findOneOrFail(
      { id, isRemoved: false },
      {
        select: ['authorId'],
      },
    )
    this.passportPermitService.permitOrFail(comment.authorId)
    this.articleCommentRepository.update(
      { id },
      {
        removedAt: new Date(),
        isRemoved: true,
      },
    )
  }
}
