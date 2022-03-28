import { applyDecorators } from '@nestjs/common'
import { ApiForbiddenResponse } from '@nestjs/swagger'
import { ApiAuthGuard } from './api-auth-guard'

export const ApiPermittable = () =>
  applyDecorators(
    ApiAuthGuard(),
    ApiForbiddenResponse({
      description: 'You are not the owner of this entity',
    }),
  )
