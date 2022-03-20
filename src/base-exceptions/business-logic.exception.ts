import { HttpException, HttpStatus } from '@nestjs/common'

interface IBusinessLogicError {
  code: string
  message: string
}

export class BusinessLogicException extends HttpException {
  constructor(error: IBusinessLogicError) {
    super(
      {
        errorCode: error.code,
        errorMessage: error.message,
      },
      HttpStatus.BAD_REQUEST,
    )
  }
}
