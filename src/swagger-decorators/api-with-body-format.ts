import { ApiBadRequestResponse } from '@nestjs/swagger'

export const REQUEST_BODY_INCORRECT_FORMAT_MSG =
  'Request body is not in the correct format.'

export const ApiWithBodyFormat = () =>
  ApiBadRequestResponse({
    description: REQUEST_BODY_INCORRECT_FORMAT_MSG,
  })
