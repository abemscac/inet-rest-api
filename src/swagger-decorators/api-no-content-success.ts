import { ApiNoContentResponse } from '@nestjs/swagger'

export const ApiNoContentSuccess = () =>
  ApiNoContentResponse({
    description: 'Success',
  })
