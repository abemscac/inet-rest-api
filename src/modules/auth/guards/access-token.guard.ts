import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'
import { IsPublicMetadataSymbol } from '../decorators/is-public.decorator'
import { AccessTokenStrategyName } from '../strategies/access-token.strategy'

@Injectable()
export class AccessTokenAuthGuard extends AuthGuard(AccessTokenStrategyName) {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic: boolean | undefined = this.reflector.getAllAndOverride(
      IsPublicMetadataSymbol,
      [context.getHandler(), context.getClass()],
    )
    return isPublic || super.canActivate(context)
  }
}
