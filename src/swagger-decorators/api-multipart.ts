import { applyDecorators } from '@nestjs/common'
import {
  ApiConsumes,
  ApiHeader,
  ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger'

export const MULTIPART_HEADER = 'multipart/form-data'

export const ApiMultipart = () =>
  applyDecorators(
    ApiHeader({
      name: 'Content-Type',
      description: MULTIPART_HEADER,
      required: true,
    }),
    ApiConsumes(MULTIPART_HEADER),
    ApiUnsupportedMediaTypeResponse({
      description: 'Unsupported media type',
    }),
  )
