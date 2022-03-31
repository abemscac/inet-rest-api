import { ApiBadRequestResponse } from '@nestjs/swagger'
import { IBusinessLogicError } from '~/base-exceptions/business-logic.exception'
import { getApiBusinessLogicErrorDescription } from './api-with-business-logic-error'

interface ApiBadRequestResponsesOptions {
  queryFormat?: boolean
  bodyFormat?: boolean
  businessLogicErrors?: Array<IBusinessLogicError>
  reasons?: Array<string>
}

export const ApiBadRequestResponses = (
  options: ApiBadRequestResponsesOptions,
) => {
  const { queryFormat, bodyFormat, businessLogicErrors, reasons } = options
  const allReasons: Array<string> = []

  if (queryFormat) {
    allReasons.push('Request query params are not in the correct format.')
  }
  if (bodyFormat) {
    allReasons.push('Request body is not in the correct format.')
  }
  businessLogicErrors?.forEach((error) => {
    allReasons.push(getApiBusinessLogicErrorDescription(error))
  })
  reasons?.forEach((reason) => {
    allReasons.push(reason)
  })

  let description: string | undefined = undefined
  if (allReasons.length > 0) {
    if (allReasons.length === 1) {
      description = allReasons[0]
    } else {
      const liString = allReasons.reduce(
        (result, reason) => result + `<li>${reason}</li>`,
        '',
      )
      description = `Could be one of the following reasons: <ul>${liString}</li>`
    }
  }

  return ApiBadRequestResponse({
    description,
  })
}
