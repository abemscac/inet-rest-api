import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { IsPublicMetadataSymbol } from '../decorators/is-public.decorator'
import { AccessTokenStrategyName } from '../strategies/access-token.strategy'

@Injectable()
export class AccessTokenAuthGuard extends AuthGuard(AccessTokenStrategyName) {
  constructor(private reflector: Reflector) {
    super()
  }

  private isPublic(context: ExecutionContext): boolean | undefined {
    return this.reflector.getAllAndOverride(IsPublicMetadataSymbol, [
      context.getHandler(),
      context.getClass(),
    ])
  }

  handleRequest(
    err: unknown,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any,
    info: unknown,
    context: ExecutionContext,
  ) {
    if (this.isPublic(context) || user) {
      // By the design of AuthGuard from passport, the "user" here will be false (yes, boolean)
      // when error occurred. Super weird.
      return !user ? undefined : user
    } else if (user) {
      return user
    } else {
      throw new UnauthorizedException()
    }
  }
}
