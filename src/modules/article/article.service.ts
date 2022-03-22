import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IPagableViewModel } from 'src/shared-view-models/i-pagable.view-model'
import { DateUtil } from 'src/utils/date.util'
import { Repository } from 'typeorm'
import { PassportPermitService } from '../passport-permit/passport-permit.service'
import { UserBrowseHistoryService } from '../user-browse-history/user-browse-history.service'
import { Article } from './article.entity'
import { ArticleCreateForm } from './forms/article-create.form'
import { ArticleUpdateForm } from './forms/article-update.form'
import {
  ArticleFindTopByQueryParams,
  ArticleFindTopByQueryTimeInterval,
} from './params/article-find-top-by-query.params'
import { ArticleViewModelProjector } from './projectors/article-view-model.projector'
import { IArticleViewModel } from './view-models/i-article.view-model'

export interface IArticleService {
  findTopByQuery(
    params: ArticleFindTopByQueryParams,
  ): Promise<IPagableViewModel<IArticleViewModel>>
  findById(id: number): Promise<IArticleViewModel>
  create(form: ArticleCreateForm): Promise<IArticleViewModel>
  updateById(id: number, form: ArticleUpdateForm): Promise<void>
  removeById(id: number): Promise<void>
}

@Injectable()
export class ArticleService implements IArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly userBrowseHistoryService: UserBrowseHistoryService,
    private readonly passportPermitService: PassportPermitService,
  ) {}

  async findTopByQuery(
    params: ArticleFindTopByQueryParams,
  ): Promise<IPagableViewModel<IArticleViewModel>> {
    const { interval, categoryId } = params
    const projector = new ArticleViewModelProjector(
      this.articleRepository,
      'article',
    ).orderBy('article.views', 'DESC')

    if (categoryId !== undefined) {
      projector
        .where('articleCategory.id = :categoryId', { categoryId })
        .andWhere('article.isRemoved = :isRemoved', { isRemoved: false })
    } else {
      projector.where('article.isRemoved = :isRemoved', { isRemoved: false })
    }

    if (interval) {
      const now = new Date()
      let minCreatedAt: Date
      if (interval === ArticleFindTopByQueryTimeInterval.today) {
        minCreatedAt = new Date(new Date(now).setUTCHours(0, 0, 0, 0))
      } else {
        minCreatedAt = DateUtil.timeLapse(now, {
          week: interval === ArticleFindTopByQueryTimeInterval.week ? -1 : 0,
          month: interval === ArticleFindTopByQueryTimeInterval.month ? -1 : 0,
          year: interval === ArticleFindTopByQueryTimeInterval.year ? -1 : 0,
        })
      }
      projector.andWhere('article.createdAt >= :minCreatedAt', {
        minCreatedAt,
      })
    }
    return await projector.projectPagination(params)
  }

  async findById(id: number): Promise<IArticleViewModel> {
    const article = await new ArticleViewModelProjector(
      this.articleRepository,
      'article',
    )
      .where('article.id = :id', { id })
      .projectOrFail()
    if (this.passportPermitService.user?.id) {
      // no need to await here
      this.userBrowseHistoryService.create({
        articleId: id,
      })
    }
    return article
  }

  async create(form: ArticleCreateForm): Promise<IArticleViewModel> {
    const article = this.articleRepository.create({
      ...form,
      coverImageHash: 'TODO',
      authorId: this.passportPermitService.user.id,
    })
    await this.articleRepository.insert(article)
    return await this.findById(article.id)
  }

  async updateById(id: number, form: ArticleUpdateForm): Promise<void> {
    const article = await this.articleRepository.findOneOrFail(
      { id },
      { select: ['authorId'] },
    )
    this.passportPermitService.permitOrFail(article.authorId)
    await this.articleRepository.update(
      { id },
      {
        coverImageHash: 'TODO',
        title: form.title.trim(),
        body: form.body.trim(),
      },
    )
  }

  async removeById(id: number): Promise<void> {
    const article = await this.articleRepository.findOneOrFail(
      {
        id,
        isRemoved: false,
      },
      {
        select: ['authorId'],
      },
    )
    this.passportPermitService.permitOrFail(article.authorId)
    await this.articleRepository.update(
      { id },
      {
        removedAt: new Date(),
        isRemoved: true,
      },
    )
  }
}
