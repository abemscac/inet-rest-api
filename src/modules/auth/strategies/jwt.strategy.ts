import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { IPassportPermitUser } from 'src/modules/passport-permit/i-passport-permit-user'
import { IJwtPayload } from '../interfaces/i-jwt-payload'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    })
  }

  validate(payload: IJwtPayload): IPassportPermitUser {
    return {
      id: payload.sub,
      username: payload.username,
    }
  }
}
