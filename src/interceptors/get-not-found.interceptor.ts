import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common'
import { Request } from 'express'
import { Observable, tap } from 'rxjs'

export class GetNotFoundInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>()
    return next.handle().pipe(
      tap((value) => {
        if (request.method === 'GET' && value === undefined) {
          throw new NotFoundException()
        }
      }),
    )
  }
}
