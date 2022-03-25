import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnsupportedMediaTypeException,
} from '@nestjs/common'
import { Request } from 'express'

const MULTIPART_HEADER = 'multipart/form-data'

@Injectable()
export class FileUploadGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest() as Request
    const contentType = request.headers['content-type']
    if (!contentType?.startsWith(MULTIPART_HEADER)) {
      throw new UnsupportedMediaTypeException(
        `The value of 'Content-Type' in request header must starts with '${MULTIPART_HEADER}' for this request.`,
      )
    }
    return true
  }
}
