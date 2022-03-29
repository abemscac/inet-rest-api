import { ApiForbiddenResponse } from '@nestjs/swagger'

export const ApiWithPermit = () =>
  ApiForbiddenResponse({
    description: 'You are not the owner of this entity',
  })
