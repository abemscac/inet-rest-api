export interface IPaginationViewModel<T> extends IPaginationMetadata {
  data: Array<T>
}

interface IPaginationMetadata {
  page: number
  limit?: number
  totalPages: number
  totalCount: number
}
