import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { getAppConfig } from '~/app.config'
import { IPassportPermitUser } from '~/modules/passport-permit/i-passport-permit-user'
import { IJwtPayload } from '../interfaces/i-jwt-payload'

export const RefreshTokenStrategyName = 'refresh-token'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  RefreshTokenStrategyName,
) {
  constructor() {
    const { refreshTokenSecret } = getAppConfig().inetAuth
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: refreshTokenSecret,
      passReqToCallback: true,
    })
  }

  validate(request: Request, payload: IJwtPayload): IPassportPermitUser {
    const token = request.headers.authorization?.replace('Bearer', '').trim()
    return {
      id: payload.sub,
      token: token ?? '',
    }
  }
}
