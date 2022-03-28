import { applyDecorators } from '@nestjs/common'
import { ApiForbiddenResponse } from '@nestjs/swagger'

export const ApiWithPermit = () =>
  applyDecorators(
    ApiForbiddenResponse({
      description: 'You are not the owner of this entity',
    }),
  )
