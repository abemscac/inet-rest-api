import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common'
import { EntityNotFoundError } from 'typeorm'

@Catch(EntityNotFoundError)
export class EntityNotFoundErrorFilter implements ExceptionFilter {
  catch(_: unknown, host: ArgumentsHost) {
    const httpContext = host.switchToHttp()
    const response = httpContext.getResponse()
    if ('status' in response) {
      return response.status(HttpStatus.NOT_FOUND).send()
    } else {
      return response.code(HttpStatus.NOT_FOUND).send()
    }
  }
}
