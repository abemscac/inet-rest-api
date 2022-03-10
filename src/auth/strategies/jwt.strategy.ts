import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { IAuthUser } from '../interfaces/i-auth-user'
import { IJwtPayload } from '../interfaces/i-jwt-payload'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    })
  }

  validate(payload: IJwtPayload): IAuthUser {
    return {
      id: payload.sub,
    }
  }
}
