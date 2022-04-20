import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common'
import {
  ApiHeader,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { ApiBadRequestResponses } from '~/swagger-decorators/api-bad-request-responses'
import { ApiOkExample } from '~/swagger-decorators/api-ok-example'
import { ApiWithAuth } from '~/swagger-decorators/api-with-auth'
import { MockAuth, MockLogin } from './auth.mocks'
import { AuthService } from './auth.service'
import { AuthLoginForm } from './forms/auth.login.form'
import { AccessTokenAuthGuard } from './guards/access-token.guard'
import { RefreshTokenAuthGuard } from './guards/refresh-token.guard'
import { IAuthLoginViewModel } from './view-models/i-auth-login.view-model'
import { IAuthViewModel } from './view-models/i-auth.view-model'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiBadRequestResponses({ bodyFormat: true })
  @ApiUnauthorizedResponse({
    description: 'Incorrect username or password.',
  })
  @ApiOkExample(MockLogin)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() form: AuthLoginForm): Promise<IAuthLoginViewModel> {
    return await this.authService.login(form)
  }

  @ApiOperation({ summary: 'Get a new access token by refresh token' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer RefreshToken',
    required: true,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid refresh token',
  })
  @ApiOkExample(MockAuth)
  @UseGuards(RefreshTokenAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(): Promise<IAuthViewModel> {
    return await this.authService.refresh()
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiWithAuth()
  @UseGuards(AccessTokenAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(): Promise<void> {
    return await this.authService.logout()
  }
}
