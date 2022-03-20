import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PagableParams } from 'src/shared-params/pagable.params'
import { IPagableViewModel } from 'src/shared-view-models/i-pagable.view-model'
import { Repository } from 'typeorm'
import { PassportPermitService } from '../passport-permit/passport-permit.service'
import { UserBrowseHistoryCreateForm } from './forms/user-browse-history-create.form'
import { UserBrowseHistoryViewModelProjector } from './projector/user-browse-history-view-model.projector'
import { UserBrowseHistory } from './user-browse-history.entity'
import { IUserBrowseHistoryViewModel } from './view-models/i-user-browse-history.view-model'

export interface IUserBrowseHistoryService {
  findByQuery(
    params: PagableParams,
  ): Promise<IPagableViewModel<IUserBrowseHistoryViewModel>>
  create(
    form: UserBrowseHistoryCreateForm,
  ): Promise<IUserBrowseHistoryViewModel>
  deleteById(id: number): Promise<void>
  clear(): Promise<void>
}

@Injectable()
export class UserBrowseHistoryService implements IUserBrowseHistoryService {
  constructor(
    @InjectRepository(UserBrowseHistory)
    private readonly userBrowseHistoryRepository: Repository<UserBrowseHistory>,
    private readonly passportPermitService: PassportPermitService,
  ) {}

  async findByQuery(
    params: PagableParams,
  ): Promise<IPagableViewModel<IUserBrowseHistoryViewModel>> {
    return new UserBrowseHistoryViewModelProjector(
      this.userBrowseHistoryRepository,
      'history',
    )
      .where('history.userId = :userId', {
        userId: this.passportPermitService.user.id,
      })
      .orderBy('history.createdAt', 'DESC')
      .projectPagination(params)
  }

  async create(
    form: UserBrowseHistoryCreateForm,
  ): Promise<IUserBrowseHistoryViewModel> {
    const userId = this.passportPermitService.user.id
    const { articleId } = form
    const prevHistory = await this.userBrowseHistoryRepository.findOne({
      userId,
      articleId,
    })
    let historyId = 0
    if (prevHistory) {
      // update
      const now = new Date()
      prevHistory.createdAt = now
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
    return new UserBrowseHistoryViewModelProjector(
      this.userBrowseHistoryRepository,
      'history',
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
      userId: this.passportPermitService.user.id,
    })
  }
}
