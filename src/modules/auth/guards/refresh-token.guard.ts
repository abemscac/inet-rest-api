import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { RefreshTokenStrategyName } from '../strategies/refresh-token.strategy'

@Injectable()
export class RefreshTokenAuthGuard extends AuthGuard(
  RefreshTokenStrategyName,
) {}
