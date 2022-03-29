import { ApiOkResponse } from '@nestjs/swagger'

export const MEDIA_TYPE_JSON = 'application/json'

export const ApiOkExample = <T>(example: T, description?: string) =>
  ApiOkResponse({
    content: {
      [MEDIA_TYPE_JSON]: {
        example,
      },
    },
    description,
  })
