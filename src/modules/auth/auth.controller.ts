import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthLoginForm } from './forms/auth.login.form'
import { IAuthLoginViewModel } from './view-models/i-auth-login.view-model'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() form: AuthLoginForm): Promise<IAuthLoginViewModel> {
    return await this.authService.login(form)
  }
}
