import { applyDecorators } from '@nestjs/common'
import { ApiBadRequestResponse } from '@nestjs/swagger'
import { ICursorPaginationViewModel } from '~/shared-view-models/i-cursor-pagination.view-model'
import { IPaginationViewModel } from '~/shared-view-models/i-pagination.view-model'
import { ApiOkExamples } from './api-ok-examples'

export const ApiOkPagableExample = <T>(data: Array<T>) =>
  applyDecorators(
    ApiOkExamples({
      'no pagination': {
        value: data,
      },
      default: {
        value: {
          page: 0,
          limit: 25,
          totalPages: 10,
          totalCount: 245,
          data,
        } as IPaginationViewModel<T>,
      },
      cursor: {
        value: {
          cursor: 5,
          limit: 25,
          data,
        } as ICursorPaginationViewModel<T>,
      },
    }),
    ApiBadRequestResponse({
      description: 'Query params were not in the correct format',
    }),
  )
