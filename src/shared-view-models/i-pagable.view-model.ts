import { ICursorPaginationViewModel } from './i-cursor-pagination.view-model'
import { IPaginationViewModel } from './i-pagination.view-model'

export type IPagableViewModel<T> =
  | Array<T>
  | IPaginationViewModel<T>
  | ICursorPaginationViewModel<T>
