import { ApiBadRequestResponse } from '@nestjs/swagger'

export const ApiWithBodyFormat = () =>
  ApiBadRequestResponse({
    description: 'Body is not in the correct format',
  })
