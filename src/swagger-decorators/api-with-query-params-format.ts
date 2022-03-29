import { ApiBadRequestResponse } from '@nestjs/swagger'

export const REQUEST_QUERY_INCORRECT_FORMAT_MSG =
  'Request query params are not in the correct format.'

export const ApiWithQueryParamsFormat = () =>
  ApiBadRequestResponse({
    description: REQUEST_QUERY_INCORRECT_FORMAT_MSG,
  })
