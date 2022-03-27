import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { FastifyImageFileInterceptor } from '~/interceptors/fastify-image-file.interceptor'
import { IUserViewModel } from '~/shared-view-models/i-user.view-model'
import { AccessTokenAuthGuard } from '../auth/guards/access-token.guard'
import { UserCreateForm } from './forms/user-create.form'
import { UserUpdatePasswordForm } from './forms/user-update-password.form'
import { UserUpdateProfileForm } from './forms/user-update-profile.form'
import { UserService } from './user.service'

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Find an user by username' })
  @Get(':username')
  async findByUsername(
    @Param('username') username: string,
  ): Promise<IUserViewModel> {
    return await this.userService.findByUsername(username)
  }

  @ApiOperation({ summary: 'Create an account' })
  @Post()
  @FastifyImageFileInterceptor('avatar', { required: false })
  async create(@Body() form: UserCreateForm): Promise<IUserViewModel> {
    return await this.userService.create(form)
  }

  @ApiOperation({ summary: 'Update your profile' })
  @UseGuards(AccessTokenAuthGuard)
  @Put('profile')
  @HttpCode(HttpStatus.NO_CONTENT)
  @FastifyImageFileInterceptor('avatar', { required: false })
  async updateProfile(@Body() form: UserUpdateProfileForm): Promise<void> {
    return await this.userService.updateProfile(form)
  }

  @ApiOperation({ summary: 'Update your password' })
  @UseGuards(AccessTokenAuthGuard)
  @Put('password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePassword(@Body() form: UserUpdatePasswordForm): Promise<void> {
    return await this.userService.updatePassword(form)
  }

  @ApiOperation({ summary: 'Remove your account' })
  @UseGuards(AccessTokenAuthGuard)
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(): Promise<void> {
    await this.userService.remove()
  }
}
