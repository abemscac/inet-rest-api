import { ApiBadRequestResponse } from '@nestjs/swagger'

export const ApiWithQueryParamsFormat = () =>
  ApiBadRequestResponse({
    description: 'Query params are not in the correct format',
  })
