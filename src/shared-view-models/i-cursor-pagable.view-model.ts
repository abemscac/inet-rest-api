import { ICursorPaginationViewModel } from './i-cursor-pagination.view-model'

export type ICursorPagableViewModel<T> =
  | Array<T>
  | ICursorPaginationViewModel<T>
