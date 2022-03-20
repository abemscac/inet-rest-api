export interface ICursorPaginationViewModel<T>
  extends ICursorPaginationMetadata {
  data: Array<T>
}

interface ICursorPaginationMetadata {
  cursor: number
  limit: number
}
