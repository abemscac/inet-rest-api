import { ApiCreatedResponse } from '@nestjs/swagger'

export const MEDIA_TYPE_JSON = 'application/json'

export const ApiCreatedExample = <T>(example: T, description?: string) =>
  ApiCreatedResponse({
    content: {
      [MEDIA_TYPE_JSON]: {
        example,
      },
    },
    description,
  })
