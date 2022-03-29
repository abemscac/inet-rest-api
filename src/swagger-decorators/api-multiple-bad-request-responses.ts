import { ApiBadRequestResponse } from '@nestjs/swagger'
import { IBusinessLogicError } from '~/base-exceptions/business-logic.exception'
import { REQUEST_BODY_INCORRECT_FORMAT_MSG } from './api-with-body-format'
import { getApiBusinessLogicErrorDescription } from './api-with-business-logic-error'
import { REQUEST_QUERY_INCORRECT_FORMAT_MSG } from './api-with-query-params-format'

interface ApiMultipleBadRequestResponsesOptions {
  withQueryFormat?: boolean
  withBodyFormat?: boolean
  businessLogicErrors: Array<IBusinessLogicError>
}

export const ApiMultipleBadRequestResponses = (
  options: ApiMultipleBadRequestResponsesOptions,
) => {
  const { withQueryFormat, withBodyFormat, businessLogicErrors } = options
  const reasons: Array<string> = []

  if (withQueryFormat) {
    reasons.push(REQUEST_QUERY_INCORRECT_FORMAT_MSG)
  }
  if (withBodyFormat) {
    reasons.push(REQUEST_BODY_INCORRECT_FORMAT_MSG)
  }
  businessLogicErrors.forEach((error) => {
    reasons.push(getApiBusinessLogicErrorDescription(error))
  })

  const liString = reasons.reduce(
    (result, reason) => result + `<li>${reason}</li>`,
    '',
  )

  return ApiBadRequestResponse({
    description: `Could be one of the following reasons: <ul>${liString}</li>`,
  })
}
