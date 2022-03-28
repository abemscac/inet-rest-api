import { applyDecorators } from '@nestjs/common'
import { ApiBadRequestResponse, ApiCreatedResponse } from '@nestjs/swagger'

export const MEDIA_TYPE_JSON = 'application/json'

export const ApiCreatedExample = <T>(example: T) =>
  applyDecorators(
    ApiCreatedResponse({
      content: {
        [MEDIA_TYPE_JSON]: {
          example,
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Body was not in the correct format',
    }),
  )
