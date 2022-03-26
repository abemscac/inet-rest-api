import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'
import { getAppConfig } from '~/app.config'
import { PassportPermitService } from '../passport-permit/passport-permit.service'
import { User } from '../user/user.entity'
import { AuthLoginForm } from './forms/auth.login.form'
import { IAuthLoginViewModel } from './view-models/i-auth-login.view-model'
import { IAuthViewModel } from './view-models/i-auth.view-model'

export interface IAuthService {
  login(form: AuthLoginForm): Promise<IAuthLoginViewModel>
  refresh(): Promise<IAuthViewModel>
  logout(): Promise<void>
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly passportPermitService: PassportPermitService,
  ) {}

  private async createTokens(userId: number): Promise<IAuthViewModel> {
    const { accessTokenSecret, refreshTokenSecret } = getAppConfig().inetAuth
    const accessToken = await this.jwtService.signAsync(
      {
        sub: userId,
      },
      {
        expiresIn: '15m',
        secret: accessTokenSecret,
      },
    )
    const refreshToken = await this.jwtService.signAsync(
      {
        sub: userId,
      },
      {
        expiresIn: '7d',
        secret: refreshTokenSecret,
      },
    )
    return {
      accessToken,
      refreshToken,
    }
  }

  private async updateHashedRefreshTokenById(
    id: number,
    token?: string,
  ): Promise<void> {
    const value = !token ? undefined : await bcrypt.hash(token, 10)
    await this.userRepository.update(
      { id },
      {
        hashedRefreshToken: value,
      },
    )
  }

  async login(form: AuthLoginForm): Promise<IAuthLoginViewModel> {
    const user = await this.userRepository.findOne(
      { username: form.username },
      {
        select: [
          'id',
          'username',
          'hashedPassword',
          'name',
          'avatarImageHash',
          'createdAt',
          'isRemoved',
        ],
      },
    )
    if (!user || user.isRemoved) {
      throw new UnauthorizedException()
    }

    const passwordMatched = await bcrypt.compare(
      form.password,
      user.hashedPassword,
    )
    if (!passwordMatched) {
      throw new UnauthorizedException()
    }

    const tokens = await this.createTokens(user.id)
    await this.updateHashedRefreshTokenById(user.id, tokens.refreshToken)

    return {
      id: user.id,
      username: form.username,
      name: user.name,
      avatarUrl: user.avatarImageHash,
      createdAt: user.createdAt,
      pendingRemoval: user.isRemoved,
      ...tokens,
    }
  }

  async refresh(): Promise<IAuthViewModel> {
    const { id = 0, token } = this.passportPermitService.user || {}
    const user = await this.userRepository.findOneOrFail(
      {
        id,
        isRemoved: false,
      },
      {
        select: ['hashedRefreshToken'],
      },
    )
    const tokenMatched = await bcrypt.compare(
      token ?? '',
      user.hashedRefreshToken ?? '',
    )
    if (!tokenMatched) {
      throw new UnauthorizedException()
    }
    const tokens = await this.createTokens(id)
    await this.updateHashedRefreshTokenById(id, tokens.refreshToken)
    return tokens
  }

  async logout(): Promise<void> {
    await this.updateHashedRefreshTokenById(
      this.passportPermitService.user?.id ?? 0,
      undefined,
    )
  }
}
