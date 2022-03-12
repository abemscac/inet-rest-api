import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PassportPermitService } from '../passport-permit/passport-permit.service'
import { UserService } from '../user/user.service'
import { AuthLoginForm } from './forms/auth.login.form'
import { IAuthService } from './i-auth.service'
import { IAuthLoginViewModel } from './view-models/i-auth-login.view-model'
import { IAuthViewModel } from './view-models/i-auth.view-model'

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly passportPermitService: PassportPermitService,
  ) {}

  private async createTokens(userId: number): Promise<IAuthViewModel> {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: userId,
      },
      {
        expiresIn: 60 * 15,
        secret: process.env.ACCESS_TOKEN_SECRET,
      },
    )
    const refreshToken = await this.jwtService.signAsync(
      {
        sub: userId,
      },
      {
        expiresIn: 60 * 60 * 24 * 7,
        secret: process.env.REFRESH_TOKEN_SECRET,
      },
    )
    return {
      accessToken,
      refreshToken,
    }
  }

  private async updateRefreshTokenHashById(
    id: number,
    token?: string,
  ): Promise<void> {
    const value = !token ? undefined : await bcrypt.hash(token, 10)
    await this.userService._updateRefreshTokenHashById(id, value)
  }

  async login(form: AuthLoginForm): Promise<IAuthLoginViewModel> {
    const user = await this.userService.findByUsername(form.username)
    if (!user) {
      throw new UnauthorizedException()
    }

    const passwordMatched = await bcrypt.compare(form.password, user.password)
    if (!passwordMatched) {
      throw new UnauthorizedException()
    }

    const tokens = await this.createTokens(user.id)
    await this.updateRefreshTokenHashById(user.id, tokens.refreshToken)

    return {
      id: user.id,
      username: form.username,
      name: user.name,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      ...tokens,
    }
  }

  async refresh(): Promise<IAuthViewModel> {
    const { id, token } = this.passportPermitService.user || {}
    const user = await this.userService._findById(id)
    const tokenMatched = await bcrypt.compare(
      token ?? '',
      user.refreshTokenHash ?? '',
    )
    if (!tokenMatched) {
      throw new UnauthorizedException()
    }
    const tokens = await this.createTokens(id)
    await this.updateRefreshTokenHashById(id, tokens.refreshToken)
    return tokens
  }

  async logout(): Promise<void> {
    await this.updateRefreshTokenHashById(
      this.passportPermitService.user.id,
      undefined,
    )
  }
}
