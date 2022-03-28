import { ApiOkResponse } from '@nestjs/swagger'

export const MEDIA_TYPE_JSON = 'application/json'

export const ApiOkExample = <T>(example: T) =>
  ApiOkResponse({
    content: {
      [MEDIA_TYPE_JSON]: {
        example,
      },
    },
  })
