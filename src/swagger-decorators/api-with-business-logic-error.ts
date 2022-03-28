import { ApiBadRequestResponse } from '@nestjs/swagger'
import { IBusinessLogicError } from '~/base-exceptions/business-logic.exception'

export const ApiWithBusinessLogicError = (error: IBusinessLogicError) =>
  ApiBadRequestResponse({
    description: error.message,
  })
