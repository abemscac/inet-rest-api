import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { getAppConfig } from 'src/app.config'
import { Repository } from 'typeorm'
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
    const user = await this.userRepository.findOne(
      { username: form.username },
      {
        select: [
          'id',
          'username',
          'password',
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
      avatarUrl: user.avatarImageHash,
      createdAt: user.createdAt,
      pendingRemoval: user.isRemoved,
      ...tokens,
    }
  }

  async refresh(): Promise<IAuthViewModel> {
    const { id, token } = this.passportPermitService.user || {}
    const user = await this.userRepository.findOne(
      {
        id,
        isRemoved: false,
      },
      {
        select: ['refreshTokenHash'],
      },
    )
    const tokenMatched = await bcrypt.compare(
      token ?? '',
      user?.refreshTokenHash ?? '',
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
