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
import { IUserViewModel } from 'src/shared-view-models/i-user.view-model'
import { AccessTokenAuthGuard } from '../auth/guards/access-token.guard'
import { UserCreateForm } from './forms/user-create.form'
import { UserUpdatePasswordForm } from './forms/user-update-password.form'
import { UserUpdateProfileForm } from './forms/user-update-profile.form'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':username')
  async findByUsername(
    @Param('username') username: string,
  ): Promise<IUserViewModel> {
    return await this.userService.findByUsername(username)
  }

  @Post()
  async create(@Body() form: UserCreateForm): Promise<IUserViewModel> {
    return await this.userService.create(form)
  }

  @UseGuards(AccessTokenAuthGuard)
  @Put('profile')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateProfile(@Body() form: UserUpdateProfileForm): Promise<void> {
    return await this.userService.updateProfile(form)
  }

  @UseGuards(AccessTokenAuthGuard)
  @Put('password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePassword(@Body() form: UserUpdatePasswordForm): Promise<void> {
    return await this.userService.updatePassword(form)
  }

  @UseGuards(AccessTokenAuthGuard)
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(): Promise<void> {
    await this.userService.remove()
  }
}
