import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseService, IBaseService } from 'src/base-services/base.service'
import { IPagableViewModel } from 'src/shared-view-models/i-pagable.view-model'
import { Repository } from 'typeorm'
import { Article } from '../article/article.entity'
import { PassportPermitService } from '../passport-permit/passport-permit.service'
import { ArticleComment } from './article-comment.entity'
import { ArticleCommentCreateForm } from './forms/article-comment-create.form'
import { ArticleCommentFindByQueryParams } from './params/article-comment-find-by-query.params'
import {
  ArticleCommentViewModelProjector,
  IArticleCommentViewModelProjector,
} from './projectors/article-comment-view-model.projector'
import { IArticleCommentViewModel } from './view-models/i-article-comment.view-model'

export interface IArticleCommentService extends IBaseService {
  findByQuery(
    params: ArticleCommentFindByQueryParams,
  ): Promise<IPagableViewModel<IArticleCommentViewModel>>
  create(form: ArticleCommentCreateForm): Promise<IArticleCommentViewModel>
  removeById(id: number): Promise<void>
}

@Injectable()
export class ArticleCommentService
  extends BaseService
  implements IArticleCommentService
{
  private readonly articleCommentViewModelProjector: IArticleCommentViewModelProjector

  constructor(
    @InjectRepository(ArticleComment)
    private readonly articleCommentRepository: Repository<ArticleComment>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly passportPermitService: PassportPermitService,
  ) {
    super()
    this.articleCommentViewModelProjector =
      new ArticleCommentViewModelProjector(this.articleCommentRepository)
  }

  async findByQuery(
    params: ArticleCommentFindByQueryParams,
  ): Promise<IPagableViewModel<IArticleCommentViewModel>> {
    // TODO: pagable query
    return await this.articleCommentViewModelProjector
      .useAction((queryBuilder) =>
        queryBuilder
          .where('comment.articleId = :articleId', {
            articleId: params.articleId,
          })
          .orderBy('comment.id', 'ASC')
          .getMany(),
      )
      .useMapper((entity) => entity)
      .projectAll()
  }

  async create(
    form: ArticleCommentCreateForm,
  ): Promise<IArticleCommentViewModel> {
    await this.existOrFail(this.articleRepository, {
      id: form.articleId,
      isRemoved: false,
    })
    const userId = this.passportPermitService.user.id
    const comment = this.articleCommentRepository.create({
      articleId: form.articleId,
      authorId: userId,
      body: form.body,
    })
    await this.articleCommentRepository.insert(comment)
    return await this.articleCommentViewModelProjector
      .useAction((queryBuilder) =>
        queryBuilder
          .where('comment.id = :id', { id: comment.id })
          .getOneOrFail(),
      )
      .useMapper((entity) => entity)
      .project()
  }

  async removeById(id: number): Promise<void> {
    const comment = await this.articleCommentRepository.findOneOrFail({ id })
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
