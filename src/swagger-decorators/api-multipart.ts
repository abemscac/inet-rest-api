import { applyDecorators, Type } from '@nestjs/common'
import { ApiBody, ApiConsumes } from '@nestjs/swagger'

export const ApiMultipart = <T>(type: Type<T>) =>
  applyDecorators(ApiConsumes('multipart/data'), ApiBody({ type }))
