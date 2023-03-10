import { IPaginationViewModel } from '~/shared-view-models/i-pagination.view-model'
import { ApiOkExample } from './api-ok-example'

export const ApiOkPagableExample = <T>(data: Array<T>, description?: string) =>
  ApiOkExample(
    {
      page: 0,
      limit: 25,
      totalPages: 10,
      totalCount: 245,
      data,
    } as IPaginationViewModel<T>,
    description,
  )
