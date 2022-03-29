import { ApiBadRequestResponse } from '@nestjs/swagger'
import { IBusinessLogicError } from '~/base-exceptions/business-logic.exception'

export const getApiBusinessLogicErrorDescription = (
  error: IBusinessLogicError,
) => `${error.message}<br>Response: <code>${JSON.stringify(error)}</code>`

export const ApiWithBusinessLogicError = (error: IBusinessLogicError) =>
  ApiBadRequestResponse({
    description: getApiBusinessLogicErrorDescription(error),
  })
