import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common'
import { IUserViewModel } from 'src/shared-view-models/i-user.view-model'
import { AccessTokenAuthGuard } from '../auth/guards/access-token.guard'
import { UserUpdateForm } from './forms/user-update.form'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':username')
  async findByUsername(
    @Param('username') username: string,
  ): Promise<IUserViewModel> {
    return await this.userService.findByUsername(username, {
      findOneOrFail: true,
    })
  }

  @UseGuards(AccessTokenAuthGuard)
  @Put(':id')
  async updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() form: UserUpdateForm,
  ): Promise<void> {
    return await this.userService.updateById(id, form)
  }
}
