import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { getAppConfig } from 'src/app.config'
import { IPagableViewModel } from 'src/shared-view-models/i-pagable.view-model'
import { DateUtil } from 'src/utils/date.util'
import { TypeORMUtil } from 'src/utils/typeorm.util'
import { Connection, Repository } from 'typeorm'
import { ImgurService } from '../imgur/imgur.service'
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
    private readonly imgurService: ImgurService,
    private readonly connection: Connection,
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
      // We don't care whether the creation of user-browse-history is done before the
      // API returns, so there's no need to await here.
      this.userBrowseHistoryService.create({
        articleId: id,
      })
    }
    return article
  }

  async create(form: ArticleCreateForm): Promise<IArticleViewModel> {
    return await TypeORMUtil.transaction(
      this.connection,
      async (manager, commit, rollback) => {
        const albumHash = getAppConfig().imgur.image.albumHashRecord.article
        let imageHash: string
        try {
          const image = await this.imgurService.uploadImage(form.coverImage, {
            albumHash,
          })
          imageHash = image.id
          const article = this.articleRepository.create({
            ...form,
            coverImageHash: image.id,
            authorId: this.passportPermitService.user.id,
          })
          await manager.insert(Article, article)
          await commit()
          return await this.findById(article.id)
        } catch (error) {
          await this.imgurService.deleteImage(imageHash)
          await rollback()
          throw error
        }
      },
    )
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
