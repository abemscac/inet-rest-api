import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnsupportedMediaTypeException,
} from '@nestjs/common'
import { Request } from 'express'

const MULTIPART_HEADER = 'multipart/form-data'

@Injectable()
export class ImageUploadGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest() as Request
    const contentType = request.headers['content-type']
    if (!contentType?.startsWith(MULTIPART_HEADER)) {
      throw new UnsupportedMediaTypeException(
        `The value of request header 'Content-Type' must starts with '${MULTIPART_HEADER}'`,
      )
    }
    return true
  }
}
