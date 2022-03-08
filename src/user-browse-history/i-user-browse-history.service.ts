import { CursorPagableParams } from 'src/shared-params/cursor-pagable.params'
import { ICursorPagableViewModel } from 'src/shared-view-models/i-cursor-pagable.view-model'
import { IUserBrowseHistoryViewModel } from './view-models/i-user-browse-history.view-model'

export interface IUserBrowseHistoryService {
  findByQuery(
    params: CursorPagableParams,
  ): Promise<ICursorPagableViewModel<IUserBrowseHistoryViewModel>>
  deleteById(id: number): Promise<void>
  deleteAll(): Promise<void>
}
