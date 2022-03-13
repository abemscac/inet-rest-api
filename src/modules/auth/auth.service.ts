import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { BaseService, IBaseService } from 'src/base-services/base.service'
import { Repository } from 'typeorm'
import { PassportPermitService } from '../passport-permit/passport-permit.service'
import { User } from '../user/user.entity'
import { AuthLoginForm } from './forms/auth.login.form'
import { IAuthLoginViewModel } from './view-models/i-auth-login.view-model'
import { IAuthViewModel } from './view-models/i-auth.view-model'

export interface IAuthService extends IBaseService {
  login(form: AuthLoginForm): Promise<IAuthLoginViewModel>
  refresh(): Promise<IAuthViewModel>
  logout(): Promise<void>
}

@Injectable()
export class AuthService extends BaseService implements IAuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly passportPermitService: PassportPermitService,
  ) {
    super()
  }

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
    await this.userRepository.update(
      { id },
      {
        refreshTokenHash: value,
      },
    )
  }

  async login(form: AuthLoginForm): Promise<IAuthLoginViewModel> {
    const user = await this.userRepository.findOne({ username: form.username })
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
    const user = await this.userRepository.findOne({ id })
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
