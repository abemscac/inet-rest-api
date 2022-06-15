import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'
import { getAppConfig } from '~/app.config'
import { ImageSize, ImgurUtil } from '~/utils/imgur.util'
import { PassportPermitService } from '../passport-permit/passport-permit.service'
import { User } from '../user/user.entity'
import { AuthLoginForm } from './forms/auth.login.form'
import { ILoginViewModel } from './view-models/i-login.view-model'
import { IRefreshViewModel } from './view-models/i-refresh.view-model'

export interface IAuthService {
  login(form: AuthLoginForm): Promise<ILoginViewModel>
  refresh(): Promise<IRefreshViewModel>
  logout(): Promise<void>
}

interface IAuth extends IRefreshViewModel {
  refreshToken: string
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly passportPermitService: PassportPermitService,
  ) {}

  private async createTokens(user: User): Promise<IAuth> {
    const { accessTokenSecret, refreshTokenSecret } = getAppConfig().inetAuth
    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        username: user.username,
        name: user.name,
        createdAt: user.createdAt.getTime(),
      },
      {
        expiresIn: '15m',
        secret: accessTokenSecret,
      },
    )
    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user.id,
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

  async login(form: AuthLoginForm): Promise<ILoginViewModel> {
    const user = await this.userRepository.findOne(
      { username: form.username },
      {
        select: [
          'id',
          'username',
          'hashedPassword',
          'name',
          'avatarImageHash',
          'avatarImageExt',
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

    const tokens = await this.createTokens(user)
    await this.updateHashedRefreshTokenById(user.id, tokens.refreshToken)

    return {
      avatarUrl: ImgurUtil.toLink({
        hash: user.avatarImageHash,
        ext: user.avatarImageExt,
        size: ImageSize.BigSquare,
      }),
      ...tokens,
    }
  }

  async refresh(): Promise<IRefreshViewModel> {
    const { id = 0, token } = this.passportPermitService.user || {}
    const user = await this.userRepository.findOneOrFail(
      {
        id,
        isRemoved: false,
      },
      {
        select: [
          'id',
          'username',
          'name',
          'hashedRefreshToken',
          'avatarImageHash',
          'avatarImageExt',
          'createdAt',
        ],
      },
    )
    const tokenMatched = await bcrypt.compare(
      token ?? '',
      user.hashedRefreshToken ?? '',
    )
    if (!tokenMatched) {
      throw new UnauthorizedException()
    }
    const tokens = await this.createTokens(user)
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
