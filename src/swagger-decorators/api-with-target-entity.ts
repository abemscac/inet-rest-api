import { ApiNotFoundResponse } from '@nestjs/swagger'

export const ApiWithTargetEntity = () =>
  ApiNotFoundResponse({
    description: 'Target entity does not exist',
  })
