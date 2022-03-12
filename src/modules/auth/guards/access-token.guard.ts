import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'

@Injectable()
export class AccessTokenAuthGuard extends AuthGuard('access-token') {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic: boolean | undefined = this.reflector.getAllAndOverride(
      'isPublic',
      [context.getHandler(), context.getClass()],
    )
    return isPublic || super.canActivate(context)
  }
}
