import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PagableQuery } from '~/shared-queries/pagable.query'
import { IPagableViewModel } from '~/shared-view-models/i-pagable.view-model'
import { TypeORMUtil } from '~/utils/typeorm.util'
import { Article } from '../article/article.entity'
import { PassportPermitService } from '../passport-permit/passport-permit.service'
import { CreateUserBrowseHistoryForm } from './forms/create-user-browse-history.form'
import { UserBrowseHistoryProjector } from './projector/user-browse-history.projector'
import { UserBrowseHistory } from './user-browse-history.entity'
import { IUserBrowseHistoryViewModel } from './view-models/i-user-browse-history.view-model'

export interface IUserBrowseHistoryService {
  findByQuery(
    query: PagableQuery,
  ): Promise<IPagableViewModel<IUserBrowseHistoryViewModel>>
  create(
    form: CreateUserBrowseHistoryForm,
  ): Promise<IUserBrowseHistoryViewModel | undefined>
  deleteById(id: number): Promise<void>
  clear(): Promise<void>
}

@Injectable()
export class UserBrowseHistoryService implements IUserBrowseHistoryService {
  constructor(
    @InjectRepository(UserBrowseHistory)
    private readonly userBrowseHistoryRepository: Repository<UserBrowseHistory>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly passportPermitService: PassportPermitService,
  ) {}

  async findByQuery(
    query: PagableQuery,
  ): Promise<IPagableViewModel<IUserBrowseHistoryViewModel>> {
    return new UserBrowseHistoryProjector(
      this.userBrowseHistoryRepository,
      'history',
      this.passportPermitService.user?.id as number,
    )
      .where('history.userId = :userId AND article.isRemoved = :isRemoved', {
        userId: this.passportPermitService.user?.id ?? 0,
        isRemoved: false,
      })
      .orderBy('history.id', 'DESC')
      .projectPagination(query)
  }

  // This feature should NOT be exposed as an endpoint in controller.
  async create(
    form: CreateUserBrowseHistoryForm,
  ): Promise<IUserBrowseHistoryViewModel | undefined> {
    const { id: userId = 0 } = this.passportPermitService.user ?? {}
    const { articleId } = form

    const articleExists = await TypeORMUtil.exist(this.articleRepository, {
      id: articleId,
      isRemoved: false,
    })
    if (!articleExists) {
      // Return undefined instead of throwing NotFoundException because this feature
      // is only used internally.
      // We handle this situation manually.
      return undefined
    }

    const prevHistory = await this.userBrowseHistoryRepository.findOne(
      {
        userId,
        articleId,
      },
      {
        select: ['id'],
      },
    )
    let historyId = 0
    if (prevHistory) {
      // update
      const now = new Date()
      await this.userBrowseHistoryRepository.update(
        {
          id: prevHistory.id,
        },
        {
          createdAt: now,
        },
      )
      historyId = prevHistory.id
    } else {
      // create
      const history = this.userBrowseHistoryRepository.create({
        userId,
        articleId,
      })
      await this.userBrowseHistoryRepository.insert(history)
      historyId = history.id
    }
    return new UserBrowseHistoryProjector(
      this.userBrowseHistoryRepository,
      'history',
      this.passportPermitService.user?.id as number,
    )
      .where('history.id = :historyId', { historyId })
      .project()
  }

  async deleteById(id: number): Promise<void> {
    const history = await this.userBrowseHistoryRepository.findOneOrFail(
      { id },
      {
        select: ['userId'],
      },
    )
    this.passportPermitService.permitOrFail(history.userId)
    await this.userBrowseHistoryRepository.delete({ id })
  }

  async clear(): Promise<void> {
    await this.userBrowseHistoryRepository.delete({
      userId: this.passportPermitService.user?.id ?? 0,
    })
  }
}
