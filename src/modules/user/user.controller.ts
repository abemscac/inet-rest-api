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
  Response,
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
  async create(
    @Response() response,
    @Body() form: UserCreateForm,
  ): Promise<void> {
    await this.userService.create(form)
    response.status(HttpStatus.OK).redirect('/auth/login')
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
