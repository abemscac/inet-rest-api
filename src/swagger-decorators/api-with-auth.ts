import { applyDecorators } from '@nestjs/common'
import { ApiHeader, ApiUnauthorizedResponse } from '@nestjs/swagger'

export const ApiWithAuth = () =>
  applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: 'Bearer Token',
      required: true,
    }),
    ApiUnauthorizedResponse({
      description: 'Invalid access token',
    }),
  )
