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
import { MockLogin, MockRefresh } from './auth.mocks'
import { AuthService } from './auth.service'
import { AuthLoginForm } from './forms/auth.login.form'
import { AccessTokenAuthGuard } from './guards/access-token.guard'
import { RefreshTokenAuthGuard } from './guards/refresh-token.guard'
import { ILoginViewModel } from './view-models/i-login.view-model'
import { IRefreshViewModel } from './view-models/i-refresh.view-model'

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
  async login(@Body() form: AuthLoginForm): Promise<ILoginViewModel> {
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
  @ApiOkExample(MockRefresh)
  @UseGuards(RefreshTokenAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(): Promise<IRefreshViewModel> {
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
