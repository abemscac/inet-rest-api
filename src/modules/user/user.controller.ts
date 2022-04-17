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
import { ApiBadRequestResponses } from '~/swagger-decorators/api-bad-request-responses'
import { ApiCreatedExample } from '~/swagger-decorators/api-created-example'
import { ApiMultipart } from '~/swagger-decorators/api-multipart'
import { ApiNoContentSuccess } from '~/swagger-decorators/api-no-content-success'
import { ApiOkExample } from '~/swagger-decorators/api-ok-example'
import { ApiWithAuth } from '~/swagger-decorators/api-with-auth'
import { ApiWithTargetEntity } from '~/swagger-decorators/api-with-target-entity'
import { AccessTokenAuthGuard } from '../auth/guards/access-token.guard'
import { CreateUserForm } from './forms/create-user.form'
import { UpdateAvatarForm } from './forms/update-avatar-form'
import { UpdatePasswordForm } from './forms/update-password.form'
import { UpdateProfileForm } from './forms/update-profile.form'
import { UserErrors } from './user.errors'
import { MockUserViewModel } from './user.mocks'
import { UserService } from './user.service'
import { IUserDetailViewModel } from './view-models/i-user-detail.view-model'

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Find an user by username' })
  @ApiWithTargetEntity('user')
  @ApiOkExample(MockUserViewModel)
  @Get(':username')
  async findByUsername(
    @Param('username') username: string,
  ): Promise<IUserDetailViewModel> {
    return await this.userService.findByUsername(username)
  }

  @ApiOperation({ summary: 'Create an account' })
  @ApiMultipart()
  @ApiBadRequestResponses({
    bodyFormat: true,
    businessLogicErrors: [UserErrors.DuplicateUsername],
  })
  @ApiCreatedExample(MockUserViewModel)
  @Post()
  @FastifyImageFileInterceptor('avatar', { required: false })
  async create(@Body() form: CreateUserForm): Promise<IUserViewModel> {
    return await this.userService.create(form)
  }

  @ApiOperation({ summary: 'Update your avatar' })
  @ApiMultipart()
  @ApiWithAuth()
  @ApiWithTargetEntity('user')
  @ApiOkExample(MockUserViewModel.avatarUrl, 'The url of new avatar.')
  @UseGuards(AccessTokenAuthGuard)
  @Put('my-avatar')
  @FastifyImageFileInterceptor('avatar', { required: true })
  async updateMyAvatar(@Body() form: UpdateAvatarForm): Promise<string> {
    return await this.userService.updateMyAvatar(form)
  }

  @ApiOperation({ summary: 'Remove your avatar' })
  @ApiWithAuth()
  @ApiWithTargetEntity('user')
  @ApiNoContentSuccess()
  @UseGuards(AccessTokenAuthGuard)
  @Delete('my-avatar')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMyAvatar(): Promise<void> {
    return await this.userService.removeMyAvatar()
  }

  @ApiOperation({ summary: 'Update your profile' })
  @ApiBadRequestResponses({ bodyFormat: true })
  @ApiWithAuth()
  @ApiWithTargetEntity('user')
  @ApiNoContentSuccess()
  @UseGuards(AccessTokenAuthGuard)
  @Put('my-profile')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateMyProfile(@Body() form: UpdateProfileForm): Promise<void> {
    return await this.userService.updateMyProfile(form)
  }

  @ApiOperation({ summary: 'Update your password' })
  @ApiBadRequestResponses({
    bodyFormat: true,
    businessLogicErrors: [UserErrors.OldPasswordUnmatched],
  })
  @ApiWithAuth()
  @ApiWithTargetEntity('user')
  @ApiNoContentSuccess()
  @UseGuards(AccessTokenAuthGuard)
  @Put('my-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateMyPassword(@Body() form: UpdatePasswordForm): Promise<void> {
    return await this.userService.updateMyPassword(form)
  }

  @ApiOperation({ summary: 'Remove your account' })
  @ApiWithAuth()
  @ApiWithTargetEntity('user')
  @ApiNoContentSuccess()
  @UseGuards(AccessTokenAuthGuard)
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(): Promise<void> {
    await this.userService.remove()
  }
}
