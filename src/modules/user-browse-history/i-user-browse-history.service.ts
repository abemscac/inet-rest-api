import { PagableParams } from 'src/shared-params/pagable.params'
import { IPagableViewModel } from 'src/shared-view-models/i-pagable.view-model'
import { IUserBrowseHistoryViewModel } from './view-models/i-user-browse-history.view-model'

export interface IUserBrowseHistoryService {
  findByQuery(
    params: PagableParams,
  ): Promise<IPagableViewModel<IUserBrowseHistoryViewModel>>
  deleteById(id: number): Promise<void>
  deleteAll(): Promise<void>
}
