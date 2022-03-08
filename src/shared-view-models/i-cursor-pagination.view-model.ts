export interface ICursorPaginationViewModel<T> {
  metadata: ICursorPaginationMetadata
  data: Array<T>
}

interface ICursorPaginationMetadata {
  cursor: number
  limit: number
  end: boolean
}
