import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IPagableViewModel } from 'src/shared-view-models/i-pagable.view-model'
import { Repository } from 'typeorm'
import { PassportPermitService } from '../passport-permit/passport-permit.service'
import { UserBrowseHistoryService } from '../user-browse-history/user-browse-history.service'
import { Article } from './article.entity'
import { ArticleCreateForm } from './forms/article-create.form'
import { ArticleUpdateForm } from './forms/article-update.form'
import { ArticleFindMostPopularByQueryParams } from './params/article-find-most-popular-by-query.params'
import { ArticleViewModelProjector } from './projectors/article-view-model.projector'
import { IArticleViewModel } from './view-models/i-article.view-model'

export interface IArticleService {
  findMostPopularByQuery(
    params: ArticleFindMostPopularByQueryParams,
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

  async findMostPopularByQuery(
    params: ArticleFindMostPopularByQueryParams,
  ): Promise<IPagableViewModel<IArticleViewModel>> {
    return []
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
        coverImageUrl: form.coverImageUrl.trim(),
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
