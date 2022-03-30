import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BusinessLogicException } from '~/base-exceptions/business-logic.exception'
import { IPagableViewModel } from '~/shared-view-models/i-pagable.view-model'
import { DateUtil } from '~/utils/date.util'
import { ImgurUtil } from '~/utils/imgur.util'
import { TypeORMUtil } from '~/utils/typeorm.util'
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
  ArticleCreatedWithin,
  ArticleFindByQueryParams,
} from './params/article-find-by-query.params'
import { ArticleProjector } from './projectors/article.projector'
import { IArticleViewModel } from './view-models/i-article.view-model'

export interface IArticleService {
  findByQuery(
    params: ArticleFindByQueryParams,
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
  ) {}

  async findByQuery(
    params: ArticleFindByQueryParams,
  ): Promise<IPagableViewModel<IArticleViewModel>> {
    const { createdWithin, categoryId } = params
    const projector = new ArticleProjector(
      this.articleRepository,
      'article',
    ).orderBy('article.views', 'DESC')

    if (categoryId !== undefined) {
      await this.validateCategory(categoryId)
      projector.where('articleCategory.id = :categoryId', { categoryId })
    }
    if (params.keyword) {
      projector.andWhere(
        `(
          LOWER(article.title) LIKE :keyword OR
          LOWER(author.name) LIKE :keyword
        )`,
        { keyword: `%${params.keyword.toLowerCase()}%` },
      )
    }
    if (params.authorUsername) {
      projector.andWhere('author.username = :authorUsername', {
        authorUsername: params.authorUsername,
      })
    }

    projector.andWhere('article.isRemoved = :isRemoved', { isRemoved: false })

    if (createdWithin) {
      const now = new Date()
      let minCreatedAt: Date
      if (createdWithin === ArticleCreatedWithin.today) {
        minCreatedAt = new Date(new Date(now).setUTCHours(0, 0, 0, 0))
      } else {
        minCreatedAt = DateUtil.timeLapse(now, {
          week: createdWithin === ArticleCreatedWithin.week ? -1 : 0,
          month: createdWithin === ArticleCreatedWithin.month ? -1 : 0,
          year: createdWithin === ArticleCreatedWithin.year ? -1 : 0,
        })
      }
      projector.andWhere('article.createdAt >= :minCreatedAt', {
        minCreatedAt,
      })
    }
    return await projector.projectPagination(params)
  }

  async findById(id: number): Promise<IArticleViewModel> {
    const article = await new ArticleProjector(
      this.articleRepository,
      'article',
    )
      .where('article.id = :id AND article.is_removed = :isRemoved', {
        id,
        isRemoved: false,
      })
      .projectOrFail()

    // The increment doesn't have to be done before the API returns, so there's no need to await here.
    this.articleRepository
      .createQueryBuilder()
      .update(Article)
      .set({ views: () => 'views + 1' })
      .where({ id })
      .execute()

    if (this.passportPermitService.user?.id) {
      // The creation of user-browse-history doesn't have to be done before the
      // API returns, so there's no need to await here.
      this.userBrowseHistoryService.create({
        articleId: id,
      })
    }

    return article
  }

  async create(form: ArticleCreateForm): Promise<IArticleViewModel> {
    await this.validateCategory(form.categoryId)

    let imageHash = '',
      articleId = 0
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
        authorId: this.passportPermitService.user?.id,
      })
      await this.articleRepository.insert(article)
      articleId = article.id
    } catch (error) {
      if (imageHash) {
        await this.imgurService.deleteImage(imageHash)
      }
      throw error
    }

    return await this.findById(articleId)
  }

  async updateById(id: number, form: ArticleUpdateForm): Promise<void> {
    const article = await this.articleRepository.findOneOrFail(
      { id },
      { select: ['categoryId', 'coverImageHash', 'authorId'] },
    )
    this.passportPermitService.permitOrFail(article.authorId)

    const categoryChanged = form.categoryId !== article.categoryId
    if (categoryChanged) {
      await this.validateCategory(form.categoryId)
    }

    const partialArticle: Partial<Article> = {
      categoryId: categoryChanged ? form.categoryId : undefined,
      title: form.title,
      body: form.body,
    }

    let newImageHash = ''
    try {
      if (form.coverImage) {
        const newImage = await this.imgurService.uploadImage(form.coverImage, {
          album: ImgurAlbum.Article,
        })
        newImageHash = newImage.id
        partialArticle.coverImageHash = newImage.id
        partialArticle.coverImageExt = ImgurUtil.getExtFromLink(newImage.link)
        await this.articleRepository.update({ id }, partialArticle)
        await this.imgurService.deleteImage(article.coverImageHash)
      }
    } catch (error) {
      if (newImageHash) {
        await this.imgurService.deleteImage(newImageHash)
      }
      throw error
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
