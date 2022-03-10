import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UserService } from 'src/user/user.service'
import { AuthLoginForm } from './forms/auth.login.form'
import { IAuthService } from './i-auth.service'
import { IAuthLoginViewModel } from './view-models/i-auth-login.view-model'

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(form: AuthLoginForm): Promise<IAuthLoginViewModel> {
    const user = await this.userService.findByUsername(form.username)
    if (!user) {
      throw new UnauthorizedException()
    }

    const passwordMatched = await bcrypt.compare(form.password, user.password)
    if (!passwordMatched) {
      throw new UnauthorizedException()
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
    })

    return {
      id: user.id,
      username: form.username,
      name: user.name,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      accessToken,
    }
  }
}
