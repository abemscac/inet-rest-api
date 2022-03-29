import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnsupportedMediaTypeException,
} from '@nestjs/common'
import { Request } from 'express'
import { MULTIPART_HEADER } from '~/swagger-decorators/api-multipart'

@Injectable()
export class FileUploadGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest() as Request
    const contentType = request.headers['content-type']
    if (!contentType?.startsWith(MULTIPART_HEADER)) {
      throw new UnsupportedMediaTypeException(
        `The value of request header 'Content-Type' must starts with '${MULTIPART_HEADER}' for this request.`,
      )
    }
    return true
  }
}
