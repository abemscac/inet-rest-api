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
import { ApiCreatedExample } from '~/swagger-decorators/api-created-example'
import { ApiMultipart } from '~/swagger-decorators/api-multipart'
import { ApiMultipleBadRequestResponses } from '~/swagger-decorators/api-multiple-bad-request-responses'
import { ApiNoContentSuccess } from '~/swagger-decorators/api-no-content-success'
import { ApiOkExample } from '~/swagger-decorators/api-ok-example'
import { ApiWithAuth } from '~/swagger-decorators/api-with-auth'
import { ApiWithBusinessLogicError } from '~/swagger-decorators/api-with-business-logic-error'
import { ApiWithTargetEntity } from '~/swagger-decorators/api-with-target-entity'
import { AccessTokenAuthGuard } from '../auth/guards/access-token.guard'
import { UserCreateForm } from './forms/user-create.form'
import { UserUpdatePasswordForm } from './forms/user-update-password.form'
import { UserUpdateProfileForm } from './forms/user-update-profile.form'
import { UserErrors } from './user.errors'
import { MockUserViewModel } from './user.mocks'
import { UserService } from './user.service'

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
  ): Promise<IUserViewModel> {
    return await this.userService.findByUsername(username)
  }

  @ApiOperation({ summary: 'Create an account' })
  @ApiMultipart()
  @ApiMultipleBadRequestResponses({
    withBodyFormat: true,
    businessLogicErrors: [UserErrors.DuplicateUsername],
  })
  @ApiCreatedExample(MockUserViewModel)
  @Post()
  @FastifyImageFileInterceptor('avatar', { required: false })
  async create(@Body() form: UserCreateForm): Promise<IUserViewModel> {
    return await this.userService.create(form)
  }

  @ApiOperation({ summary: 'Update your profile' })
  @ApiMultipart()
  @ApiWithAuth()
  @ApiMultipleBadRequestResponses({
    withBodyFormat: true,
    businessLogicErrors: [UserErrors.PendingRemoval],
  })
  @ApiWithTargetEntity('user')
  @ApiNoContentSuccess()
  @UseGuards(AccessTokenAuthGuard)
  @Put('profile')
  @HttpCode(HttpStatus.NO_CONTENT)
  @FastifyImageFileInterceptor('avatar', { required: false })
  async updateProfile(@Body() form: UserUpdateProfileForm): Promise<void> {
    return await this.userService.updateProfile(form)
  }

  @ApiOperation({ summary: 'Update your password' })
  @ApiWithAuth()
  @ApiMultipleBadRequestResponses({
    withBodyFormat: true,
    businessLogicErrors: [
      UserErrors.PendingRemoval,
      UserErrors.OldPasswordUnmatched,
    ],
  })
  @ApiWithTargetEntity('user')
  @ApiNoContentSuccess()
  @UseGuards(AccessTokenAuthGuard)
  @Put('password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePassword(@Body() form: UserUpdatePasswordForm): Promise<void> {
    return await this.userService.updatePassword(form)
  }

  @ApiOperation({ summary: 'Remove your account' })
  @ApiWithAuth()
  @ApiWithBusinessLogicError(UserErrors.PendingRemoval)
  @ApiWithTargetEntity('user')
  @ApiNoContentSuccess()
  @UseGuards(AccessTokenAuthGuard)
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(): Promise<void> {
    await this.userService.remove()
  }
}
