import { ICursorPaginationViewModel } from '~/shared-view-models/i-cursor-pagination.view-model'
import { IPaginationViewModel } from '~/shared-view-models/i-pagination.view-model'
import { ApiOkExamples } from './api-ok-examples'

export const ApiOkPagableExample = <T>(data: Array<T>, description?: string) =>
  ApiOkExamples(
    {
      'No pagination': {
        value: data,
      },
      Basic: {
        value: {
          page: 0,
          limit: 25,
          totalPages: 10,
          totalCount: 245,
          data,
        } as IPaginationViewModel<T>,
      },
      Cursor: {
        value: {
          cursor: 5,
          limit: 25,
          data,
        } as ICursorPaginationViewModel<T>,
      },
    },
    description,
  )
