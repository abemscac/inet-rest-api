import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BusinessLogicException } from 'src/base-exceptions/business-logic.exception'
import { IPagableViewModel } from 'src/shared-view-models/i-pagable.view-model'
import { DateUtil } from 'src/utils/date.util'
import { ImgurUtil } from 'src/utils/imgur.util'
import { TypeORMUtil } from 'src/utils/typeorm.util'
import { Connection, Repository } from 'typeorm'
import { ArticleCategory } from '../article-category/article-category.entity'
import { ImgurAlbum } from '../imgur/imgur.constants'
import { ImgurService } from '../imgur/imgur.service'
import { PassportPermitService } from '../passport-permit/passport-permit.service'
import { UserBrowseHistoryService } from '../user-browse-history/user-browse-history.service'
import { Article } from './article.entity'
import { ArticleErrors } from './article.errors'
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
    @InjectRepository(ArticleCategory)
    private readonly articleCategoryRepository: Repository<ArticleCategory>,
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

    // We don't care whether the increment of views is done before the
    // API returns, so there's no need to await here.
    this.articleRepository.update(
      { id },
      {
        views: article.views + 1,
      },
    )

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
    await this.validateCategory(form.categoryId)
    return await TypeORMUtil.transaction(
      this.connection,
      async (manager, commit, rollback) => {
        let imageHash: string, articleId: number
        try {
          const image = await this.imgurService.uploadImage(form.coverImage, {
            album: ImgurAlbum.Article,
          })
          imageHash = image.id
          const article = this.articleRepository.create({
            categoryId: form.categoryId,
            coverImageHash: image.id,
            coverImageExt: ImgurUtil.getExtFromLink(image.link),
            title: form.title,
            body: form.body,
            authorId: this.passportPermitService.user.id,
          })
          await manager.insert(Article, article)
          await commit()
          articleId = article.id
          return await this.findById(article.id)
        } catch (error) {
          if (imageHash) await this.imgurService.deleteImage(imageHash)
          if (articleId) await rollback()
          throw error
        }
      },
    )
  }

  async updateById(id: number, form: ArticleUpdateForm): Promise<void> {
    const article = await this.articleRepository.findOneOrFail(
      { id },
      { select: ['categoryId', 'coverImageHash', 'authorId'] },
    )
    this.passportPermitService.permitOrFail(article.authorId)

    if (form.categoryId !== article.categoryId) {
      await this.validateCategory(form.categoryId)
    }

    const [trimmedTitle, trimmedBody] = [form.title.trim(), form.body.trim()]

    if (!form.coverImage) {
      await this.articleRepository.update(
        { id },
        {
          title: trimmedTitle,
          body: trimmedBody,
        },
      )
    } else {
      await TypeORMUtil.transaction(
        this.connection,
        async (manager, commit, rollback) => {
          try {
            const image = await this.imgurService.uploadImage(form.coverImage, {
              album: ImgurAlbum.Article,
            })
            await manager.update(
              Article,
              { id },
              {
                categoryId: form.categoryId,
                coverImageHash: image.id,
                coverImageExt: ImgurUtil.getExtFromLink(image.link),
                title: trimmedTitle,
                body: trimmedBody,
              },
            )
            await this.imgurService.deleteImage(article.coverImageHash)
            await commit()
          } catch (error) {
            // TODO: write log into files to catch uploaded-but-never-used image and
            // failed-removal image
            await rollback()
            throw error
          }
        },
      )
    }
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

  private async validateCategory(categoryId: number): Promise<void> {
    const categoryExists = await TypeORMUtil.exist(
      this.articleCategoryRepository,
      {
        id: categoryId,
      },
    )
    if (!categoryExists) {
      throw new BusinessLogicException(ArticleErrors.CategoryDoesNotExist)
    }
  }
}
