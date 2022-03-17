export interface IPaginationViewModel<T> {
  metadata: IPaginationMetadata
  data: Array<T>
}

interface IPaginationMetadata {
  page: number
  limit?: number
  totalPages: number
  totalCount: number
}
