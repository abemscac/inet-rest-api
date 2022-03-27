import { ApiOkResponse as SwaggerApiOkResponse } from '@nestjs/swagger'
import { ExampleObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'
import { MEDIA_TYPE_JSON } from './api-ok-example'

export const ApiOkExamples = (examples: Record<string, ExampleObject>) =>
  SwaggerApiOkResponse({
    content: {
      [MEDIA_TYPE_JSON]: {
        examples,
      },
    },
  })
