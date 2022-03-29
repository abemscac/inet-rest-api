import { ApiBadRequestResponse } from '@nestjs/swagger'
import { IBusinessLogicError } from '~/base-exceptions/business-logic.exception'
import { REQUEST_BODY_INCORRECT_FORMAT_MSG } from './api-with-body-format'
import { getApiBusinessLogicErrorDescription } from './api-with-business-logic-error'
import { REQUEST_QUERY_INCORRECT_FORMAT_MSG } from './api-with-query-params-format'

interface ApiMultipleBadRequestResponsesOptions {
  withQueryFormat?: boolean
  withBodyFormat?: boolean
  businessLogicErrors?: Array<IBusinessLogicError>
  reasons?: Array<string>
}

export const ApiMultipleBadRequestResponses = (
  options: ApiMultipleBadRequestResponsesOptions,
) => {
  const { withQueryFormat, withBodyFormat, businessLogicErrors, reasons } =
    options
  const allReasons: Array<string> = []

  if (withQueryFormat) {
    allReasons.push(REQUEST_QUERY_INCORRECT_FORMAT_MSG)
  }
  if (withBodyFormat) {
    allReasons.push(REQUEST_BODY_INCORRECT_FORMAT_MSG)
  }
  businessLogicErrors?.forEach((error) => {
    allReasons.push(getApiBusinessLogicErrorDescription(error))
  })
  reasons?.forEach((reason) => {
    allReasons.push(reason)
  })

  const liString = allReasons.reduce(
    (result, reason) => result + `<li>${reason}</li>`,
    '',
  )

  return ApiBadRequestResponse({
    description: `Could be one of the following reasons: <ul>${liString}</li>`,
  })
}
