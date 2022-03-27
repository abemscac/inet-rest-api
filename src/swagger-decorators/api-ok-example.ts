import { ApiOkResponse as SwaggerApiOkResponse } from '@nestjs/swagger'

export const MEDIA_TYPE_JSON = 'application/json'

export const ApiOkExample = <T>(example: T) =>
  SwaggerApiOkResponse({
    content: {
      [MEDIA_TYPE_JSON]: {
        example,
      },
    },
  })
